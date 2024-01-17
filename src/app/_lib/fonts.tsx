import * as fontkit from 'fontkit';
import { buffer } from 'stream/consumers';

export const fetchExternalFont = async (url:string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
    }
    return response.blob();
}

export const loadFont = async (fontName:string, buffer: ArrayBuffer) => {
    const font = new FontFace(`${fontName}`, buffer);
    await font.load();
    document.fonts.add(font);
    // const demoText = document.querySelector('.demo-text');
    // demoText.style.fontFamily = 'testFont';
}

export const fontTest = async (buffer:ArrayBuffer)=>{
    const font = await fontkit.create(Buffer.from(buffer));
    return font.fullName;
}

export const checkFontFile = async (file: File) => {
    // Check the file type (accepts only OTF, TTF, WOFF, WOFF2)
    const fontFormats = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'];
    let type;
    if (!file.type || !fontFormats.includes(file.type)) {
        // Reads the 4 first bytes of the file to get the font type
        const start = file.slice(0, 4) // Blob
        const txt = await start.text();
        const signature = [...txt].map(x => x.codePointAt(0)?.toString(16).padStart(2, '0')).join('').toUpperCase()
        switch (signature) {
            case '00010000':
                type = 'font/ttf';
                break;
            case '774F4646':
                type = 'font/woff';
                break;
            case '774F4632':
                type = 'font/woff2';
                break;
            case '4F54544F':
                type = 'font/otf';
                break;
            default:
                throw new Error("Incorrect file type.")
        }
    } else {
        type = file.type;
    }
    return type;
}