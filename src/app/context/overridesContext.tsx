import { createContext, useContext, ReactNode, useReducer } from "react";
import { FontOverridesType } from "../../../types/types";

type Action =
    | { type: 'setInfos', payload: object }
    | { type: 'reset'; payload: null };

const initialState: FontOverridesType[] = [];

export const OverridesContext = createContext<FontOverridesType[]>(initialState);

export const OverridesDispatchContext = createContext<React.Dispatch<Action>>(() => { });

export function useOverrides() {
    const context = useContext(OverridesContext);
    if (!context) {
        throw new Error("useOverrides must be used within a context provider!");
    }
    return context;
}

export function useOverridesDispatch() {
    const context = useContext(OverridesDispatchContext);
    if (!context) {
        throw new Error("useOverridesDispatch must be used within a context provider!");
    }
    return context;
}

export function OverridesProvider({ value, children }: { value: FontOverridesType[], children: ReactNode }) {
    const [state, dispatch] = useReducer(overridesReducer, initialState);

    return (
        <OverridesDispatchContext.Provider value={dispatch}>
            <OverridesContext.Provider value={state}>
                {children}
            </OverridesContext.Provider>
        </OverridesDispatchContext.Provider>
    )
}

const overridesReducer = (overrides: FontOverridesType[], { type, payload }: Action) => {
    switch (type) {

        case 'setInfos': {
            return payload as FontOverridesType[]
        }

        case 'reset': {
            return [];
        }

        default: {
            return overrides;
        }
    }

}