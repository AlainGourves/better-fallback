'use client';

import { ReactNode, useEffect } from 'react';
import { UserDataProvider, useUserData, useUserDataDispatch } from '@/app/context/userData';


export function ContextProvider({ children }: { children: ReactNode }) {

    const userData = useUserData();
    const dispatch = useUserDataDispatch();

    return (
        <UserDataProvider value={userData}>
            {children}
        </UserDataProvider>
    );
}