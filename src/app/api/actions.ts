'use server';

import { readFileSync } from 'fs';
import path from 'path';
import Font, * as fontkit from 'fontkit';
import { getFontType, getFontSize } from '../_lib/fonts';


type FrequencyMap = {
    [key: string]: number
}
type LanguageFrequency = {
    lang: string,
    fraq: FrequencyMap
}
type LanguagesArray = LanguageFrequency[];

type FbFontData = {
    lang: string;
    width: number;
};

type FbFont = {
    name: string;
    fullName: string;
    postscriptName: string;
    upm: number;
    data: FbFontData[];
};

type FbFontsArray = FbFont[];

type ResponseType = {
    success: boolean,
    message: string | object
}

let myFont: Font.Font | undefined;

export async function getFontInfos(prevState: ResponseType, formData: FormData) {
    // let font: Font.Font;
    let fontInfos = {};

    const url = formData.get('fontUrl') as string;
    const file = formData.get('font-upload') as File;
    try {
        const { size, type, font } = url ? await loadFetchedFont(url) : await loadUploadedFont(file);

        if (font) {
            fontInfos = {
                fullName: font.fullName,
                familyName: font.familyName,
                type: type,
                size: getFontSize(size),
            }
            console.log(">>>>", font.fullName)
            myFont = font;
        }
    } catch (err) {
        return {
            success: false,
            message: err?.toString()
        }
    }

    return {
        success: true,
        message: fontInfos
    }
}

let rawdata = readFileSync(process.cwd() + '/src/app/api/frequencies.json', 'utf8');
const frequencies = JSON.parse(rawdata);
rawdata = readFileSync(process.cwd() + '/src/app/api/fallbacksInfos.json', 'utf8');
const fallbacks = JSON.parse(rawdata);


export async function getFontOverrides(prevState: ResponseType, formData: FormData) {


    console.log("hello from server");

    const fallbackFont = formData.get('fallbackFontSelect') as string;
    const lang = formData.get('targetLanguage') as string;

    let fontOverrides = {};
    try {
        if (myFont) {
            const fallbackFontInfos = getFallbackInfos(fallbackFont);
            const sizeAdjust = await getSizeAdjust(myFont, fallbackFontInfos, lang);
            console.log("sizeAdjust", sizeAdjust)
            const upm = myFont.unitsPerEm
            const ascent = formatForCSS(myFont.ascent / (upm * sizeAdjust));
            console.log('97', myFont.descent)
            const descent = formatForCSS(myFont.descent / (upm * sizeAdjust));
            const lineGap = formatForCSS(myFont.lineGap / (upm * sizeAdjust));
            fontOverrides = {
                'fullName': fallbackFontInfos.fullName,
                'postscriptName': fallbackFontInfos.postscriptName,
                'ascent': ascent,
                'descent': descent,
                'lineGap': lineGap,
                'sizeAdjust': formatForCSS(sizeAdjust),
            }
        } else {
            throw new Error("I've lost the font! 😭");
        }

    } catch (err) {
        return {
            success: false,
            message: err?.toString()
        }
    }

    return {
        success: true,
        message: fontOverrides
    }
}

// Utility functions ------------------

const loadFetchedFont = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`)
        }
        const buffer = await response.arrayBuffer();
        const size = buffer.byteLength;
        const type = await getFontType(new File([buffer], 'web font'));
        const font = fontkit.create(new Uint8Array(buffer) as Buffer);
        return { size, type, font }
    } catch (err) {
        throw new Error(err as any);
    }
}

const loadUploadedFont = async (file: File) => {
    try {
        const type = file.type;
        const size = file.size;
        const buffer = await file.arrayBuffer()
        const font = fontkit.create(new Uint8Array(buffer) as Buffer);
        return { size, type, font }
    } catch (err) {
        throw new Error(err as any);
    }
}

const getAvgWidth = async (font: Font.Font, freq: FrequencyMap) => {
    let width = 0;
    const chars = Object.keys(freq);
    chars.forEach((char) => {
        const unicode = char.codePointAt(0); // get Unicode code point for the char
        const glyph = font.glyphForCodePoint(unicode as number);
        width += glyph.advanceWidth * freq[char] // char width weighted by its frequency
    });
    return width;
}

const getFrequencies = (lang: string) => {
    const obj = frequencies.find((o: LanguageFrequency) => o.lang === lang);
    return obj.freq;
}


const getFallbackAvgWidth = (fb: FbFont, lang: string) => {
    const data = fb.data.find((o: FbFontData) => o.lang === lang);
    return data?.width;
}

const getFallbackInfos = (name: string) => {
    const obj = fallbacks.find((o: FbFont) => o.name === name);
    return obj;
}

const getSizeAdjust = async (font: Font.Font, fbInfos: FbFont, lang: string) => {
    const freq = getFrequencies(lang);
    // Average with of the submitted font
    const avgWidthFont = await getAvgWidth(font, freq);
    const fontUPM = font.unitsPerEm;
    // Average with of the fallback font
    const avgWidthFallback = getFallbackAvgWidth(fbInfos, lang);
    const fallbackUPM = fbInfos.upm;
    if (avgWidthFallback) {
        const sizeAdjust = (avgWidthFont / avgWidthFallback) * (fallbackUPM / fontUPM);
        return sizeAdjust;
    }else{
        throw new Error(`Impossible to get average width for ${fbInfos.fullName}`)
    }
}

// returns percentages (with 3 digits precision)
// Math.abs() is necessary as `descent` value is negative
// whereas `descent-override` is a percentage
const formatForCSS = (x:number) => `${parseFloat(Math.abs(x * 100).toFixed(3))}%`;