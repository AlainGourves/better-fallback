import { createContext, useContext, ReactNode, useReducer } from "react";
import { FontOverridesType, overridesDefault } from "../../../types/types";

type Action =
    | { type: 'setInfos', payload: object }
    | { type: 'reset'; payload: null };

export const OverridesContext = createContext<FontOverridesType>(overridesDefault);

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

export function OverridesProvider({ value, children }: { value: FontOverridesType, children: ReactNode }) {
    const [state, dispatch] = useReducer(overridesReducer, overridesDefault);

    return (
        <OverridesDispatchContext.Provider value={dispatch}>
            <OverridesContext.Provider value={state}>
                {children}
            </OverridesContext.Provider>
        </OverridesDispatchContext.Provider>
    )
}

const overridesReducer = (overrides: FontOverridesType, { type, payload }: Action) => {
    switch (type) {

        case 'setInfos': {
            return {
                ...overrides,
                ...payload
            }
        }

        case 'reset': {
            return overridesDefault;
        }

        default: {
            return overrides;
        }
    }

}