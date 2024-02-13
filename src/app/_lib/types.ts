// See: https://stackoverflow.com/questions/52085454/typescript-define-a-union-type-from-an-array-of-strings
const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'] as const;
export type FontTypes = typeof fontTypes[number];


const fallbackFonts = ['arial', 'roboto', 'times'] as const;
export type FallbackFontsType = typeof fallbackFonts[number];


const languages = ['en', 'fr'] as const;
export type LanguagesType = typeof languages[number];