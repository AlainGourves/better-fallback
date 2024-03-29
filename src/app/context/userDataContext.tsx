'use client';

import { createContext, useReducer, useContext, ReactNode } from "react";
import { FallbackFontsType, LanguagesType, UserDataType } from "../../../types/types";


export const defaultUserData = {
    showUserText: false,
    userText: '',
    language: "en" as LanguagesType,
    languageChangedNotif: false,
    fallbackFont: 'times' as FallbackFontsType,
    fontSize: '24',
    opacity: '0.8',
    color: '#ff0000'
}

type Action =
    | { type: 'showDemoText'; payload: { value: boolean } }
    | { type: 'changeDemoText'; payload: { value: string } }
    | { type: 'changeFontSize'; payload: { value: string } }
    | { type: 'changeOpacity'; payload: { value: string } }
    | { type: 'changeColor'; payload: { value: string } }
    | { type: 'changeFontFamily'; payload: { value: FallbackFontsType } }
    | { type: 'changeLanguage'; payload: { value: LanguagesType } }
    | { type: 'changeLanguageNotif'; payload: { value: boolean } }
    | { type: 'changeAll'; payload: UserDataType }
    | { type: 'reset'; payload: null };

// Provides the current state of userData
export const UserDataContext = createContext<UserDataType>(defaultUserData);
// Provides the function that lets components dispatch actions
export const UserDataDispatchContext = createContext<React.Dispatch<Action>>(() => { });

export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUserData must be used within a context provider!');
    }
    return context;
}

export function useUserDataDispatch() {
    const context = useContext(UserDataDispatchContext);
    if (!context) {
        throw new Error('useUserData must be used within a context provider!');
    }
    return context;
}

export function UserDataProvider({ value, children }: { value: UserDataType, children: ReactNode }) {

    const [state, dispatch] = useReducer(userDataReducer, defaultUserData)

    return (
        <UserDataDispatchContext.Provider value={dispatch}>
            <UserDataContext.Provider value={state}>
                {children}
            </UserDataContext.Provider>
        </UserDataDispatchContext.Provider>
    )
}

const userDataReducer = (userData: UserDataType, { type, payload}: Action) => {
    switch (type) {
        case 'changeOpacity': {
            return {
                ...userData,
                opacity: payload.value
            }
        }
        case 'changeColor': {
            return {
                ...userData,
                color: payload.value
            }
        }

        case 'changeFontSize': {
            return {
                ...userData,
                fontSize: payload.value.toString()
            }
        }

        case 'changeLanguage': {
            return {
                ...userData,
                language: payload.value as LanguagesType
            }
        }

        case 'changeLanguageNotif': {
            return {
                ...userData,
                languageChangedNotif: payload.value
            }
        }

        case 'changeFontFamily': {
            return {
                ...userData,
                fallbackFont: payload.value as FallbackFontsType
            }
        }

        case 'changeDemoText': {
            return {
                ...userData,
                userText: payload.value
            }
        }

        case 'showDemoText': {
            return {
                ...userData,
                showUserText: payload.value
            }
        }

        case 'changeAll': {
            // to load from localStorage
            return {
                ...userData,
                showUserText: payload.showUserText,
                userText: payload.userText,
                fallbackFont: payload.fallbackFont,
                fontSize: payload.fontSize,
                language: payload.language,
                opacity: payload.opacity,
                color: payload.color,
            }
        }

        case 'reset': {
            return defaultUserData
        }

        default: {
            return userData;
        }
    }
}