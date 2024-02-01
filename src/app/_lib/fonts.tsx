import Font, * as fontkit from 'fontkit';
import { buffer } from 'stream/consumers';

export const fetchFont = async (url: string): Promise<File> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
    }
    const blob = await response.blob();
    return new File([blob], "Web Font", { type: blob.type });
}

export const loadFont = async (fontName: string, file: File) => {
    try {
        const buff = await file.arrayBuffer();
        const font = new FontFace(fontName, buff);
        await font.load();
        document.fonts.add(font);
    } catch (err) {
        throw new Error(`Problem loading font '${fontName}'. ${err}`);
    }
}

export const fontKitLoad = async (file: File) => {
    const buff = await file.arrayBuffer();
    return fontkit.create(new Uint8Array(buff) as Buffer);
}

export const getFontType = async (file: File) => {
    // Check the file type (accepts only OTF, TTF, WOFF, WOFF2)
    // Returns the font type or null
    const fontFormats = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'];
    let type= null;
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
        }
    } else {
        type = file.type;
    }
    return type;
}

// Formats fonts size
// n: number (size in bytes)
// returns :string (size in ko, ex: '21.2ko')
export const getFontSize = (n: number)=>{
    let size:number|string = Math.round(n / 100) / 10;
    if (!Number.isInteger(size)) {
        size = size.toFixed(1);
    }
    return `${size}ko`;
}

// Get a font name from its URL
export const getFontName = (str: string)=>{
    try{
        const url = new URL(str);
        const path = url.pathname;
        const regex = /\/([a-z-]{2,})[./]/i; // a sequence of 2 or more letters between slashes
        const match = path.match(regex);
        if (match){
             return match[1];
        }else{
            return undefined;
        }
    }catch(err) {
        // rethrow error
        throw new Error(err as string);
    }
}