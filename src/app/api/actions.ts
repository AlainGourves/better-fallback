'use server';

import { readFileSync } from 'fs';
import * as fontkit from 'fontkit';
import { getFontType, getFontSize } from '../_lib/fonts';
import { FontOverridesType, overridesDefault } from '../../../types/types';


type FrequencyMap = {
    [key: string]: number
}
type LanguageFrequency = {
    lang: string,
    freq: FrequencyMap
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
    file: string;
    upm: number;
    data: FbFontData[];
};

type FbFontsArray = FbFont[];

type ResponseType = {
    status: 'unset'|'success'|'error',
    message: string | object,
    id?: string,
}

let myFont: fontkit.Font | undefined;

export async function getFontInfos(prevState: ResponseType, formData: FormData) {
    // let font: Font.Font;
    let fontInfos = {};

    const url = formData.get('fontUrl') as string;
    const file = formData.get('font-upload') as File;
    const reqId = formData.get('reqId') as string;
    try {
        const { size, type, font } = url ? await loadFetchedFont(url) : await loadUploadedFont(file);

        if (font as fontkit.Font) {
            fontInfos = {
                fullName: font.fullName,
                postscriptName: font.postscriptName,
                familyName: font.familyName,
                type: type,
                size: getFontSize(size),
            }
            console.log(">>>>", font.fullName)
            myFont = font;
        }
    } catch (err:any) {
        return {
            status: 'error',
            message: err?.message,
            id: reqId
        }
    }

    return {
        status: 'success',
        message: fontInfos,
        id: reqId
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

    let fontOverrides = overridesDefault;
    // TODO: calculer les FMO pour les 3 polices (en mettant en premier celle qui est sélectionnée)
    //  -> renvoyer un array d'objets 'fontOverrides'
    try {
        if (myFont) {
            const fallbackFontInfos = getFallbackInfos(fallbackFont);
            const sizeAdjust = await getSizeAdjust(myFont, fallbackFontInfos, lang);
            const upm = myFont.unitsPerEm
            const ascent = formatForCSS(myFont.ascent / (upm * sizeAdjust));
            const descent = formatForCSS(myFont.descent / (upm * sizeAdjust));
            const lineGap = formatForCSS(myFont.lineGap / (upm * sizeAdjust));
            fontOverrides = {
                'fullName': fallbackFontInfos.fullName,
                'postscriptName': fallbackFontInfos.postscriptName,
                'file': fallbackFontInfos.file,
                'ascent': ascent,
                'descent': descent,
                'lineGap': lineGap,
                'sizeAdjust': formatForCSS(sizeAdjust),
                'isActive': true,
                'overridesName': `fallback for ${myFont.postscriptName}`
            }
        } else {
            throw new Error("I've lost the font! 😭");
        }

    } catch (err) {
        return {
            status: 'error',
            message: err?.toString()
        }
    }

    return {
        status: 'success',
        message: fontOverrides
    }
}

// Utility functions ------------------

const loadFetchedFont = async (url: string) => {
    try {
        const response = await fetch(url);
        console.log("coucou", response.status)
        if (!response.ok) {
            // console.log(typeof response.status)
            throw new Error(`${response.status} ${response.statusText}`)
        }
        const buffer = await response.arrayBuffer();
        const size = buffer.byteLength;
        const type = await getFontType(new File([buffer], 'web font'));
        const font = fontkit.create(new Uint8Array(buffer) as Buffer) as fontkit.Font;
        return { size, type, font }
    } catch (err) {
        if(err instanceof TypeError && err.message === 'fetch failed') {
            throw new Error("Impossible to load a font file, please check your URL.")
        }else{
            throw new Error(err as any);
        }
    }
}

const loadUploadedFont = async (file: File) => {
    try {
        const type = file.type;
        const size = file.size;
        const buffer = await file.arrayBuffer()
        const font = fontkit.create(new Uint8Array(buffer) as Buffer) as fontkit.Font;
        return { size, type, font }
    } catch (err) {
        throw new Error(err as any);
    }
}

const getAvgWidth = async (font: fontkit.Font, freq: FrequencyMap) => {
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

const getSizeAdjust = async (font: fontkit.Font, fbInfos: FbFont, lang: string) => {
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
    } else {
        throw new Error(`Impossible to get average width for ${fbInfos.fullName}`)
    }
}

// returns percentages (with 2 digits precision)
// Math.abs() is necessary as `descent` value is negative
// whereas `descent-override` is a percentage
const formatForCSS = (x: number) => `${parseFloat(Math.abs(x * 100).toFixed(2))}%`;