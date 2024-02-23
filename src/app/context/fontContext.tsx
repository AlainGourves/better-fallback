import { createContext, useContext, ReactNode, useReducer } from "react";
import { FontInfosType } from "@/app/_lib/types";
import { unloadFont } from "../_lib/fonts";
import { updateCustomProperty } from "../_lib/utils";

export const defaultFontInfos = {
    url: null,
    file: null,
    fullName: null,
    postscriptName: null,
    familyName: null,
    type: null,
    size: null,
}

type Action =
    | { type: 'setFile', payload: { value: File } }
    | { type: 'setURL', payload: { value: string } }
    | { type: 'setInfos', payload: object }
    | { type: 'reset'; payload: null };

export const FontInfosContext = createContext<FontInfosType>(defaultFontInfos);

export const FontInfosDispatchContext = createContext<React.Dispatch<Action>>(() => { });

export function useFontInfos() {
    return useContext(FontInfosContext);
}

export function useFontInfosDispatch() {
    return useContext(FontInfosDispatchContext);
}

export function FontInfosProvider({ value, children }: { value: FontInfosType, children: ReactNode }) {

    const [state, dispatch] = useReducer(fontInfosReducer, defaultFontInfos);

    return (
        <FontInfosDispatchContext.Provider value={dispatch}>
            <FontInfosContext.Provider value={state}>
                {children}
            </FontInfosContext.Provider>
        </FontInfosDispatchContext.Provider>
    )
}

const fontInfosReducer = (fontInfos: FontInfosType, { type, payload }:Action) => {
    // 'file' & 'url' are mutually exclusive : if one is set, the other must be null
    switch (type) {
        case 'setFile': {
            return {
                ...defaultFontInfos,
                file: payload.value,
            }
        }

        case 'setURL': {
            return {
                ...defaultFontInfos,
                url: payload.value
            }
        }

        case 'setInfos': {
            return {
                ...fontInfos,
                ...payload
            }
        }

        case 'reset': {
            // delete FontFace from document.fonts & reset CSS custom prop
            if (fontInfos.postscriptName){
                unloadFont(fontInfos.postscriptName);
                updateCustomProperty('--tested-font');
            }
            return defaultFontInfos
        }

        default: {
            return fontInfos;
        }
    }
}