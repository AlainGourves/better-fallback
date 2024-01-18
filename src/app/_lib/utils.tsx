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

// TODO: moment de la validation !!!
/*
Actuellement ça cherche à valider à chaque `change`
=> c'est invalide tout le temps !! (sauf à coller une url complète)

==> ne valider qu'au moement d'utiliser `fontUrl`
*/

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