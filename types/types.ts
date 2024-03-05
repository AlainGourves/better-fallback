// See: https://stackoverflow.com/questions/52085454/typescript-define-a-union-type-from-an-array-of-strings
export const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'] as const;
export type FontTypes = typeof fontTypes[number];


export const fallbackFonts = ['arial', 'roboto', 'times'] as const;
export type FallbackFontsType = typeof fallbackFonts[number];


const languages = ['en', 'fr'] as const;
export type LanguagesType = typeof languages[number];

export type FontOverridesType = {
  name: string,
  fullName: string,
  postscriptName: string,
  file: string, // path to the fallback fonts in /public
  ascent: string,
  descent: string,
  lineGap: string,
  sizeAdjust: string,
  isActive: boolean,  
  overridesName: string,
}

export const overridesDefault = {
  name: '',
  fullName: '',
  postscriptName: '',
  file: '',
  ascent: '',
  descent: '',
  lineGap: '',
  sizeAdjust: '',
  isActive: false,
  overridesName: ''
}

export type FontInfosType = {
  file: File | null,
  url: string | null,
  fullName: string | null,
  postscriptName: string | null,
  familyName: string | null,
  type: FontTypes | null,
  size: string | null,
}


export type UserDataType = {
  showUserText: boolean,
  userText: string | undefined,
  language: LanguagesType,
  fallbackFont: FallbackFontsType,
  fontSize: string,
  color: string,
  opacity: string,
}