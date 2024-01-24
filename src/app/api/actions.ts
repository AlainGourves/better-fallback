'use server';

export async function getFormData(prevState:any, formData: FormData):Promise<void> {

    console.log(`fallbackFontSelect -> ${formData.get('fallbackFontSelect')}`);
    console.log(`targetLanguage -> ${formData.get('targetLanguage')}`);
}