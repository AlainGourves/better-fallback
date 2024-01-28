'use server';

import * as fontkit from 'fontkit';
import { getFontType, getFontSize } from '../_lib/fonts';

type ResponseType = {
    success: boolean,
    message: string | object
}

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