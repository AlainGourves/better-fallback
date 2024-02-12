import { ReactNode, createContext, useContext } from "react";
import { FallbackFontsType, LanguagesType } from "../page";

type UserDataType = {
    userText: string | undefined,
    language: LanguagesType,
    fallbackFont: FallbackFontsType,
    fontSize: string,
    opacity: string,
}

const defaultData = {
    userText: '',
    language: "en" as LanguagesType,
    fallbackFont: 'times' as FallbackFontsType,
    fontSize: '24',
    opacity: '0.8'
}
const UserDataContext = createContext<UserDataType>(defaultData);

const useUserData = () => {
    useContext(UserDataContext);
}

const UserDataProvider = ({ value, children }:{value:UserDataType, children:ReactNode}) => {
    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    )
}

export { UserDataProvider, useUserData };