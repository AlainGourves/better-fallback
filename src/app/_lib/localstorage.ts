'use client';

export const supportsLocalStorage = () => {
    let supports = false;
    if ('localStorage' in window) {
        supports = true;
    }
    return supports;
}

export const saveToLocalStorage = (key: string, val: string) => {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
        console.warn("Save to localStorage error", err);
    }
}

export const getLocalStorage = (key: string) => {
    try {
        return JSON.parse(localStorage.getItem(key) || '');
    } catch (err) {
        console.warn(`LocalStorage error getting key '${key}'`, err);
    }
}