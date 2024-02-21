export const URLValidator = (str: string): boolean => {
    try {
        const url = new URL(str);
        // extension's validation
        const regex = /\.otf|ttf|woff|woff2$/;
        if (regex.test(url.pathname)) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

// TODO: File size validation
/*
Mettre une limite + gestion d'erreur et affichage adéquat
pour upload ET Url
 -> voir comment récupérer la taille du fichier (dans fetch ?)
*/

/* A REGARDER

element.setCustomValidity([message d'erreur])
-> met l'élément dans l'état :invalid

element.reportValidity()
-> affiche le tooltip avec le message

element.setCustomValidity('')
-> enlève l'état :invalid

*/

import type {FontTypes} from '@/app/_lib/types'
// Returns acceptable file types for input[type=file]
// arr: array of mimes types
// MacOS recognizes "font/ttf" or ".woff2", but not "font/woff2" for eg.
// hence the need to extract extensions from mime types
export const listAcceptable = (arr: FontTypes[])=>{
    const regex =/font\/(.+)/; // to get file extensions
    const ext = arr.map(val => `.${val.replace(regex, "$1")}`);
    return [...arr, ...ext].join(',');
}


export const copyToClipboard =async (txt: string)=>{
    if (navigator.clipboard) {
        if (txt) {
            await navigator.clipboard.writeText(txt);
        }
    } else {
        alert("You'll have to manually copy the code 😢")
    }
}

export const updateCustomProperty = (name:string, val:string|undefined)=> {
    const value = val ? val : ' ';
    document.body.style.setProperty(`${name}`, `${value}`);
}