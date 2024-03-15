// See: https://stackoverflow.com/questions/52085454/typescript-define-a-union-type-from-an-array-of-strings
export const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'] as const;
export type FontTypes = typeof fontTypes[number];


export const fallbackFonts = ['arial', 'roboto', 'times'] as const;
export type FallbackFontsType = typeof fallbackFonts[number];


const languages = ['en', 'fr'] as const;
export type LanguagesType = typeof languages[number];

export type FontOverridesType = {
  name: string, // 'arial' | 'roboto' | 'times'
  fullName: string, // fallback full name
  postscriptName: string, // fallback postscript name (one word)
  file: string, // path to the fallback fonts in /public
  ascent: string,
  descent: string,
  lineGap: string,
  sizeAdjust: string,
  language:LanguagesType, // targeted language for the overrides
  isActive: boolean,
  overridesName: string, // name for fallback font with overrides (eg. "Times fallback for Anton-Regular")
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
  language: 'en' as LanguagesType,
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
  languageChangedNotif: boolean,
  fallbackFont: FallbackFontsType,
  fontSize: string,
  color: string,
  opacity: string,
}