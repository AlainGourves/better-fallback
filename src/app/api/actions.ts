'use server';

import Font, * as fontkit from 'fontkit';
import {getFontType} from '../_lib/fonts';

type ResponseType= {
    success: boolean,
    message: string|object
}

export async function getFontInfos(prevState: ResponseType, formData: FormData) {

    let font: Font.Font;
    let fontInfos = {};

    const url = formData.get('fontUrl') as string;
    const file = formData.get('font-upload') as File;
    if (url) {
        // if (file.size === 0 && url) {
        console.log(">>>>", url)
        try {
            // 1) Validate URL
            // 2) Fetch the font
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
            const buffer = await response.arrayBuffer();
            font = fontkit.create(new Uint8Array(buffer) as Buffer);
            const type = await getFontType(new File([buffer], 'web font'));
            fontInfos = {
                fullName: font.fullName,
                familyName: font.familyName,
                type: type,
                size: buffer.byteLength,
                metrics: {
                    UPM: font.unitsPerEm,
                    ascent: font.ascent,
                    descent: font.descent,
                    lineGap: font.lineGap,
                }
            }
            console.log(">>>>", font.fullName)
        } catch (err) {
            return {
                success: false,
                message: err?.toString()
            }
        }
    }

    return {
        success: true,
        message: fontInfos
     }
}