import { ReactNode, createContext, useContext, useReducer } from "react";
import { FallbackFontsType, LanguagesType } from "../page";

type UserDataType = {
    userText: string | undefined,
    language: LanguagesType,
    fallbackFont: FallbackFontsType,
    fontSize: string,
    opacity: string,
}


const ACTIONS = {
    CHANGE_DEMO_TEXT: 'changeDemoText',
    CHANGE_FONT: 'changeFontFamily',
    CHANGE_FONT_SIZE: 'changeFontSize',
    CHANGE_OPACITY: 'changeOpacity',
    CHANGE_LANGUAGE: 'changeLanguage',
}

type UserAction = {
    type: any,
    payload: string | LanguagesType | LanguagesType
}

const defaultUserData = {
    userText: '',
    language: "en" as LanguagesType,
    fallbackFont: 'times' as FallbackFontsType,
    fontSize: '24',
    opacity: '0.8'
}
const UserDataContext = createContext<UserDataType>(defaultUserData);


const useUserData = () => {
    return useContext(UserDataContext);
}




const UserDataProvider = ({ value, children }: { value: UserDataType, children: ReactNode }) => {

    const reducer = function (userData: UserDataType, action: any) {
        const { type, payload } = action;
        switch (type) {
            case ACTIONS.CHANGE_OPACITY:
                return {
                    ...userData,
                    opacity: payload.value.toString()
                }
                break;

            default:
                //
                return userData;
        }
    }

    const [userData, dispatch] = useReducer(reducer, defaultUserData);

    const setOpacity = (newVal: string | number) => {
        dispatch({
            type: 'CHANGE_OPACITY',
            payload: {
                value: newVal
            }
        })
    }

    return (
        <UserDataContext.Provider value={userData}>
            {children}
        </UserDataContext.Provider>
    )
}

export { UserDataProvider, useUserData, defaultUserData };