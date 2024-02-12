import { createContext, useReducer, PropsWithChildren, useContext } from "react";
import { FallbackFontsType, LanguagesType } from "../page";

type UserDataType = {
    userText: string | undefined,
    language: LanguagesType,
    fallbackFont: FallbackFontsType,
    fontSize: string,
    opacity: string,
}

const defaultUserData = {
    userText: '',
    language: "en" as LanguagesType,
    fallbackFont: 'times' as FallbackFontsType,
    fontSize: '24',
    opacity: '0.8'
}

type ActionTypes = 'changeDemoText' | 'changeFontFamily' | 'changeFontSize' | 'changeOpacity' | 'changeLanguage' | 'none';

type Actions = {
    type: ActionTypes,
    payload: {
        value: string,
    }
}

const defaultAction = {
    type: 'none' as ActionTypes,
    payload: {
        value: ''
    }
}

export const UserDataContext = createContext<UserDataType>(defaultUserData);
export const UserDataDispatchContext = createContext({});

export function useUserData() {
    return useContext(UserDataContext);
}

export function useUserDataDispatch() {
    return useContext(UserDataDispatchContext);
}

export function UserDataProvider({ children }: PropsWithChildren) {
    const [userData, dispatch] = useReducer(userReducer, defaultUserData)

    return (
        <UserDataContext.Provider value={userData}>
            <UserDataDispatchContext.Provider value={dispatch}>
                {children}
            </UserDataDispatchContext.Provider>
        </UserDataContext.Provider>
    )
}

function userReducer(userData: UserDataType, action: Actions) {
    const { type, payload } = action;
    switch (type) {
        case 'changeOpacity': {
            return {
                ...userData,
                opacity: payload.value.toString()
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

        default: {
            return userData;
        }
    }
}