'use client';

import { ReactNode, useEffect } from 'react';
import { UserDataProvider, useUserData, useUserDataDispatch } from '@/app/context/userData';


export function ContextProvider({ children }: { children: ReactNode }) {

    const userData = useUserData();
    const dispatch = useUserDataDispatch();


    useEffect(() => {
        // Load user settings from localStorage
        if ('localStorage' in window) {
            console.log("in useEffect")

            const storage = localStorage.getItem('userSettings');
            if (storage) {
                const settings = JSON.parse(storage);
                console.log("----------> from ContextProvider", settings)
                dispatch({
                    type: "changeAll",
                    payload: settings
                });
            }
        }
    }, []);

    return (
        <UserDataProvider value={userData}>
            {children}
        </UserDataProvider>
    );
}