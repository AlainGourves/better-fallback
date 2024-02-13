'use client';

import { createContext, useReducer, useContext, ReactNode } from "react";
import { FallbackFontsType, LanguagesType } from "@/app/_lib/types";

export type UserDataType = {
    userText: string | undefined,
    language: LanguagesType,
    fallbackFont: FallbackFontsType,
    fontSize: string,
    opacity: string,
}

export const defaultUserData = {
    userText: '',
    language: "en" as LanguagesType,
    fallbackFont: 'times' as FallbackFontsType,
    fontSize: '24',
    opacity: '0.8'
}

type Action =
    | { type: 'changeDemoText'; payload: { value: string } }
    | { type: 'changeFontSize'; payload: { value: string } }
    | { type: 'changeOpacity'; payload: { value: string } }
    | { type: 'changeFontFamily'; payload: { value: FallbackFontsType } }
    | { type: 'changeLanguage'; payload: { value: LanguagesType } }
    | { type: 'changeAll'; payload: UserDataType };

// Provides the current state of userData
export const UserDataContext = createContext<UserDataType>(defaultUserData);
// Provides the function that lets components dispatch actions
export const UserDataDispatchContext = createContext<React.Dispatch<Action>>(() => { });

export function useUserData() {
    return useContext(UserDataContext);
}

export function useUserDataDispatch() {
    return useContext(UserDataDispatchContext);
}

export function UserDataProvider({ value, children }: { value: UserDataType, children: ReactNode }) {

    const [userData, dispatch] = useReducer(userDataReducer, defaultUserData)

    return (
        <UserDataDispatchContext.Provider value={dispatch}>
            <UserDataContext.Provider value={userData}>
                {children}
            </UserDataContext.Provider>
        </UserDataDispatchContext.Provider>
    )
}

const userDataReducer = (userData: UserDataType, action: Action) => {
    const { type, payload } = action;
    switch (type) {
        case 'changeOpacity': {
            console.log("changeOpacity", payload)
            return {
                ...userData,
                opacity: payload.value
            }
        }

        case 'changeFontSize': {
            console.log("changefontSize", payload)
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

        case 'changeAll': {
            console.log("changeAll", payload)
            return {
                ...userData,
                userText: payload.userText,
                fallbackFont: payload.fallbackFont,
                fontSize: payload.fontSize,
                language: payload.language,
                opacity: payload.opacity,
            };
        }

        default: {
            return userData;
        }
    }
}