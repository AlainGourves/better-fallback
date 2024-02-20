import { createContext, useContext, ReactNode, useReducer } from "react";
import { FontInfosType } from "@/app/_lib/types";

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
    | { type: 'eraseFile', payload: null }
    | { type: 'setURL', payload: { value: string } }
    | { type: 'eraseURL', payload: null }
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
    console.log("---------->", type)
    // 'file' & 'url' are mutually exclusive : if one is set, the other must be null
    switch (type) {
        case 'setFile': {
            return {
                ...fontInfos,
                file: payload.value,
                url: null
            }
        }

        case 'eraseFile': {
            return {
                ...fontInfos,
                file: null
            }
        }

        case 'setURL': {
            return {
                ...fontInfos,
                file: null,
                url: payload.value
            }
        }

        case 'eraseURL': {
            return{
                ...fontInfos,
                url: null
            }
        }

        case 'setInfos': {
            return {
                ...fontInfos,
                ...payload
            }
        }

        case 'reset': {
            return defaultFontInfos
        }

        default: {
            return fontInfos;
        }
    }
}