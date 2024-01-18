import Font, * as fontkit from 'fontkit';
import { buffer } from 'stream/consumers';

export const fetchFont = async (url:string):Promise<File> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
    }
    const blob = await response.blob();
    return new File([blob], "Web Font", { type: blob.type });
}

export const loadFont = async (fontName:string, file: File) => {
    const buff = await file.arrayBuffer();
    const font = new FontFace(`${fontName}`, buff);
    await font.load();
    document.fonts.add(font);
}

export const fontTest = async (file:File)=>{
    const buff = await file.arrayBuffer();
    const font =  fontkit.create(new Uint8Array(buff) as Buffer);
    return font;
}

export const getFontFullName =  (buffer:ArrayBuffer)=>{
    const font =  fontkit.create(new Uint8Array(buffer) as Buffer);
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