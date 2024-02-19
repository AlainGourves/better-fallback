'use client';

import { ReactNode } from 'react';
import { UserDataProvider, useUserData, useUserDataDispatch } from '@/app/context/userData';
import { FontInfosProvider, useFontInfos } from '@/app/context/fontContext';


export function ContextProvider({ children }: { children: ReactNode }) {

    const userData = useUserData();
    const fontInfos = useFontInfos()
    // const dispatch = useUserDataDispatch();

    return (
        <FontInfosProvider value={fontInfos}>
            <UserDataProvider value={userData}>
                {children}
            </UserDataProvider>
        </FontInfosProvider>
    );
}