'use client';

import { ReactNode } from 'react';
import { UserDataProvider, useUserData } from '@/app/context/userDataContext';
import { FontInfosProvider, useFontInfos } from '@/app/context/fontContext';
import { OverridesProvider, useOverrides } from './overridesContext';


export function ContextProvider({ children }: { children: ReactNode }) {

    const userData = useUserData();
    const fontInfos = useFontInfos()
    const overrides = useOverrides();

    return (
        <UserDataProvider value={userData}>
            <FontInfosProvider value={fontInfos}>
                <OverridesProvider value={overrides}>
                    {children}
                </OverridesProvider>
            </FontInfosProvider>
        </UserDataProvider>
    );
}