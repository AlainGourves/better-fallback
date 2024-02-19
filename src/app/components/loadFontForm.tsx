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
import { useFontInfos, useFontInfosDispatch } from '../context/fontContext';

export default function LoadFontForm() {
    const fontInfos = useFontInfos();
    const dispatchFontInfos = useFontInfosDispatch();

    // Error handling
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const urlRef = useRef<HTMLInputElement>(null);

    // Input[File] for selecting a font
    const handleFontFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (!ev.target.files) return;
        // get rid of an eventual URL
        // TODO: tout faire en une seule action
        // (dans le reducer ?)
        dispatchFontInfos({
            type: "eraseURL",
            payload: null
        });
        dispatchFontInfos({
            type: "setFile",
            payload: {
                value: ev.target.files[0]
            }
        })
    }

    // 'X' button to remove previously selected font file
    const handleRemoveFontFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatchFontInfos({
            type: "eraseFile",
            payload: null
        });
        if (error === true) setError(false);
    }

    // Input[text] for font URL
    const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        if (URLValidator(val) || val === '') {
            urlRef.current?.setCustomValidity(''); // remove :invalid state if present
        }
        if (fontInfos.file) {
            // font File and font URL are exclusives
            // TODO: faire les 2 actions d'un coup dans le reducer ?
            dispatchFontInfos({
                type: "eraseFile",
                payload: null
            });
        }
        dispatchFontInfos({
            type: "setURL",
            payload: {
                value: ev.target.value
            }
        });
    };
    // button with an 'X' to erase TextInput
    const eraseTextInput = (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatchFontInfos({
            type: "eraseURL",
            payload: null
        });
        if (error === true) setError(false);
    }


    // Server actions
    const initialState = {
        success: false,
        message: null,
    }
    const [loadFormState, loadFormAction] = useFormState<any, FormData>(getFontInfos, initialState);

    // UseEffects ---------------
    useEffect(() => {
        if (loadFormState.success) {
            dispatchFontInfos({
                type: 'setInfos',
                payload: {
                    fullName: loadFormState.message?.fullName,
                    postscriptName: loadFormState.message?.postscriptName,
                    familyName: loadFormState.message?.familyName,
                    type: loadFormState.message?.type,
                    size: loadFormState.message?.size
                }
            });
        }
    }, [loadFormState]);


    useEffect(() => {
        if (!error) setErrorMessage('');
    }, [error]);


    return (
        <form
            id="select-font"
            className={formStyles["select-font"]}
            action={loadFormAction}
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
                    {fontInfos.file && (
                        <FontFile
                            name={fontInfos.file.name}
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
                    value={fontInfos.url ? fontInfos.url : ''}
                    placeholder={'Paste a font URL'}
                    onChange={handleFontURL}
                    title='Erase field'
                    onClick={eraseTextInput}
                />
                <SubmitButton
                    id="select-font-submit"
                    text={'Load the font'}
                    classAdd={'outlined'}
                    disabled={!fontInfos.url && !fontInfos.file}
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