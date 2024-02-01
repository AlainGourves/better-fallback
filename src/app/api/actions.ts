'use server';

import { readFileSync } from 'fs';
import path from 'path';
import Font, * as fontkit from 'fontkit';
import { getFontType, getFontSize } from '../_lib/fonts';


type FrequencyMap={
    [key:string]:number
}
type LanguageFrequency={
    lang:string,
    fraq:FrequencyMap
}
type LanguagesArray = LanguageFrequency[];

type FbFontData = {
    lang: string;
    width: number;
};

type FbFont = {
    name: string;
    upm: number;
    data: FbFontData[];
};

type FbFontsArray = FbFont[];

type ResponseType = {
    success: boolean,
    message: string | object
}

let myFont:Font.Font|undefined;

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
                metrics: {
                    UPM: font.unitsPerEm,
                    ascent: font.ascent,
                    descent: font.descent,
                    lineGap: font.lineGap,
                }
            }
            console.log(">>>>", font.fullName)
            myFont =  font;
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

let rawdata = readFileSync(process.cwd() + '/src/app/api/frequencies.json', 'utf8' );
const frequencies = JSON.parse(rawdata);
rawdata = readFileSync(process.cwd() + '/src/app/api/fallbackAvgWidth.json', 'utf8' );
const fallbackAvgWidth = JSON.parse(rawdata);


export async function getFontOverrides(prevState: ResponseType, formData: FormData) {


    console.log("hello from server");
    console.log(myFont?.postscriptName);

    const fallbackFont = formData.get('fallbackFontSelect') as string;
    const lang = formData.get('targetLanguage') as string;

    console.log(fallbackFont, lang)

    let fontOverrides = {};
    try {

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

const getAvgWidth = async (font: Font.Font, freq:FrequencyMap) => {
    let width = 0;
    const chars = Object.keys(freq);
    chars.forEach((char) => {
        const unicode = char.codePointAt(0); // get Unicode code point for the char
        const glyph = font.glyphForCodePoint(unicode as number);
        width += glyph.advanceWidth * freq[char] // char width weighted by its frequency
    });
    return width;
}

const getFrequencies = (lang:string) => {
    const obj = frequencies.find((o:LanguageFrequency) => o.lang === lang);
    return obj.freq;
}

const getFallbackAvgWidth = (name:string, lang:string) => {
    const obj = fallbackAvgWidth.find((o:FbFont) => o.name === name);
    const data = obj.data.find((o:FbFontData) => o.lang === lang);
    return data.width;
}

const getFallbackUPM = (name:string) => {
    const obj = fallbackAvgWidth.find((o:FbFont) => o.name === name);
    return obj.upm;
}

const getSizeAdjust = async (font:Font.Font, fallback:string, lang:string)=>{
    const freq = getFrequencies(lang);
    // Average with of the submitted font
    const avgWidthFont = await getAvgWidth(font, freq);
    const fontUPM = font.unitsPerEm;
    // Average with of the fallback font
    const avgWidthFallback = getFallbackAvgWidth(fallback, lang);
    const fallbackUPM = getFallbackUPM(fallback);
    const sizeAdjust = (avgWidthFont / avgWidthFallback) * (fallbackUPM / fontUPM);
    return sizeAdjust;
}
