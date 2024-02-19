import { useState, useRef, useEffect } from 'react';
import { useFormState } from 'react-dom';
import formStyles from './loadFontForm.module.scss';
import { getFontInfos } from '@/app/api/actions';
import Image from 'next/image';
import FontFile from './fontFile';
import TextInput from './form-components/textInput/textInput';
import SubmitButton from './submitButton';
import { URLValidator, listAcceptable } from '../_lib/utils';
import { fontTypes, FontTypes, FontInfosType } from '@/app/_lib/types'

type LoadFormType = {
    fontInfos: FontInfosType,
    formAction: string | ((formData: FormData) => void) | undefined,
}

export default function LoadFontForm(props: LoadFormType) {
    const [fontURL, setFontURL] = useState('');
    const [fontFile, setFontFile] = useState<File | null>(null);

    // Error handling
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const urlRef = useRef<HTMLInputElement>(null);


    // Input[File] for selecting a font
    const handleFontFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (!ev.target.files) return;
        setFontURL(''); // get rid of an eventual URL
        setFontFile(ev.target.files[0]);
    }

    // 'X' button to remove previously selected font file
    const handleRemoveFontFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontFile(null);
        if (error === true) setError(false);
    }

    // Input[text] for font URL
    const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        if (URLValidator(val) || val === '') {
            urlRef.current?.setCustomValidity(''); // remove :invalid state if present
        }
        if (fontFile) {
            setFontFile(null); // fontFile and fontURL are exclusives
        }
        setFontURL(ev.target.value);
    };
    // button with an 'X' to erase TextInput
    const eraseTextInput = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontURL('');
        if (error === true) setError(false);
    }


    // Server actions
    const initialState = {
        success: false,
        message: null,
    }
    const [loadFormState, loadFormAction] = useFormState<any, FormData>(getFontInfos, initialState);

    return (
        <form
            id="select-font"
            className={formStyles["select-font"]}
            action={props.formAction}
        >

            <div>
                <Image
                    src="/letter.svg"
                    width={256}
                    height={256}
                    alt="Letter capital A"
                    priority={true}
                />
                <div className={formStyles["drop-instructions"]}>
                    <span>Drop a font here</span>
                    <span>OR</span>
                    <label htmlFor='font-upload'>
                        Browse
                        <input
                            type="file"
                            id="font-upload"
                            name="font-upload"
                            accept={listAcceptable([...fontTypes] as FontTypes[])}
                            onChange={handleFontFile}
                        />
                    </label>
                    {fontFile && (
                        <FontFile
                            name={fontFile.name}
                            onClick={handleRemoveFontFile}
                        />
                    )}
                </div>
            </div>
            <div>OR</div>
            <div>
                <TextInput
                    ref={urlRef}
                    id={'fontUrl'}
                    type={'url'}
                    value={fontURL}
                    placeholder={'Paste a font URL'}
                    onChange={handleFontURL}
                    title='Erase field'
                    onClick={eraseTextInput}
                />
                <SubmitButton
                    id="select-font-submit"
                    text={'Load the font'}
                    classAdd={'outlined'}
                    disabled={!fontURL && !fontFile}
                />
            </div>
            {!loadFormState.success && loadFormState.message && (
                <div className={formStyles['error-msg-container']}>
                    <div className={formStyles['error-msg']}>
                        <h3>A problem occurred!</h3>
                        {loadFormState.message}
                    </div>
                </div>
            )}
        </form>
    );
}