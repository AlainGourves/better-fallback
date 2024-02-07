'use client';

type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | Array<JSONValue>;

export const supportsLocalStorage = ():boolean => {
    let supports = false;
    if ('localStorage' in window) {
        supports = true;
    }
    return supports;
}

export const saveToLocalStorage = (key: string, val: JSONValue) => {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
        console.warn("Save to localStorage error", err);
    }
}

export const getLocalStorage = (key: string):JSONValue|null => {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
}