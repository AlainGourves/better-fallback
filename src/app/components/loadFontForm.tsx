import { useCallback, useState, useRef, useEffect } from 'react';
import { useFormState } from 'react-dom';
import formStyles from './loadFontForm.module.scss';
import clsx from 'clsx';
import { getFontInfos } from '@/app/api/actions';
import FontFile from './fontFile';
import TextInput from './form-components/textInput/textInput';
import SubmitButton from './submitButton';
import { URLValidator, listAcceptable } from '../_lib/utils';
import { fontTypes, FontTypes } from '../../../types/types'
import { useFontInfos, useFontInfosDispatch } from '@/app/context/fontContext';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Icon } from './Icon';
import { type IconName } from '../../../types/name';


export default function LoadFontForm() {
    const fontInfos = useFontInfos();
    const dispatchFontInfos = useFontInfosDispatch();

    // Error handling
    const [error, setError] = useState(false);
    const [errorCodes, setErrorCodes] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const resetErrors = () => {
            console.log("resetErrors", errorCodes, errorMessages)
            setErrorMessages([]);
            setErrorCodes([]);
            setError(false);
    }

    const formRef = useRef<HTMLFormElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);

    // 'X' button to remove font file
    const handleRemoveFontFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatchFontInfos({
            type: "reset",
            payload: null
        });
        if (error) resetErrors();
        ev.preventDefault();
        ev.stopPropagation();
    }

    // Input[text] for font URL
    const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (error) resetErrors();
        const val = ev.target.value;
        if (URLValidator(val) || val === '') {
            urlRef.current?.setCustomValidity(''); // remove :invalid state if present
        }
        dispatchFontInfos({
            type: "setURL",
            payload: {
                value: ev.target.value
            }
        });
    };

    // 'X' button to erase TextInput
    const eraseTextInput = (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatchFontInfos({
            type: "reset",
            payload: null
        });
        if (error === true) setError(false);
    }

    // Drag & Drop ------------------------------------
    type AcceptableFile = {
        [K in FontTypes]: string[]
    }
    const objAcceptable = (arr: FontTypes[]) => {
        const regex = /font\/(.+)/; // to get file extensions
        const accept = {} as AcceptableFile;
        arr.forEach((f) => {
            const match = f.match(regex);
            if (match) {
                accept[`${f}`] = [`.${match[1]}`];
            }
        });
        return accept;
    }

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (acceptedFiles.length === 1) {
            // Add the file to the inpu[file] element (react-dropzone doesn't do it)
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(acceptedFiles[0]);
            if (formRef.current) {
                const input: HTMLInputElement | null = formRef.current.querySelector('input[type=file');
                if (input) {
                    input.files = dataTransfer.files;
                }
            }
            dispatchFontInfos({
                type: "setFile",
                payload: {
                    value: acceptedFiles[0]
                }
            });
        }
        if (fileRejections.length) {
            const codes: string[] = [];
            fileRejections.forEach((r) => {
                codes.push(r.errors[0].code);
            });
            setErrorCodes(codes);
            setError(true);
        }
    }, [dispatchFontInfos]);

    const maxFileSize = 1024 * 1024 * 2; // 2 megabytes max font size

    const onFileDialogOpen = useCallback(() => {
        if (error) resetErrors();
    }, [error]);

    const {
        acceptedFiles,
        fileRejections,
        isDragActive,
        isDragAccept,
        isDragReject,
        getRootProps,
        getInputProps,
        open
    } = useDropzone({
        onDrop: onDrop,
        accept: objAcceptable([...fontTypes]),
        onFileDialogOpen: onFileDialogOpen,
        maxFiles: 1,
        multiple: false,
        maxSize: maxFileSize,
        noClick: true, // prevent open dialog from opening twice
    });

    let hoverIcon: IconName | undefined = undefined;
    let hoverTitle = ''
    let hoverMessage = '';
    if (isDragAccept) {
        hoverIcon = 'download';
        hoverTitle = 'Drop it!';
        hoverMessage = `(like it's hot)`;
    }
    if (isDragReject) {
        hoverIcon = 'alert-triangle';
        hoverTitle = 'Attention!';
        hoverMessage = `There's an issue with what you are dragging, drop it to see the error(s).`;
    }


    // Error handling --------------------------------
    useEffect(()=>{
        if (errorCodes.length) {
            // remove duplicate codes
            const theErrors = new Set(errorCodes);
            let theMessages: string[] = [];
            theErrors.forEach((err) => {
                let msg = '';
                switch (err) {
                    case 'file-invalid-type':
                        msg = `Only font files: ${fontTypes.join(', ')}.`;
                        break;
                    case 'file-too-large':
                        msg = `Files must be less than 2Mb.`;
                        break;
                    case 'too-many-files':
                        msg = `Only one font at a time!`;
                        break;
                    default:
                        msg = 'There was a problem, the nature of which is unclear…';
                        break;
                }
                theMessages.push(msg);
            });
            setErrorMessages(errorMessages => [
                ...errorMessages,
                ...theMessages
            ]);
        }
    }, [errorCodes]);

    useEffect(() => {
        if (isDragActive) {
            resetErrors();
        }
    }, [isDragActive]);


    // Server actions --------------------------------
    const initialState = {
        status: 'unset',
        message: null,
    }

    const [loadFormState, loadFormAction] = useFormState<any, FormData>(getFontInfos, initialState);

    // UseEffects ---------------
    useEffect(() => {
        if (!formRef.current) return;
        if (loadFormState.status === 'success') {
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
    }, [loadFormState, dispatchFontInfos]);

    useEffect(() => {
        console.log("useEffect start", errorMessages)
        if (loadFormState.status === 'error') {
            // Make sure an error message is only added once
            const errMsgs = Array.from(new Set([...errorMessages, loadFormState.message]));
            if (errMsgs.length !== errorMessages.length) {
                setError(true);
                setErrorMessages(errMsgs);
                console.log("useEffect end", errorMessages)
            }
        }
    }, [loadFormState, errorMessages]);

    // console.log(fontInfos)
    return (
        <form
            ref={formRef}
            id="select-font"
            className={formStyles["select-font"]}
            action={loadFormAction}
        >

            <div  {...getRootProps({
                className: formStyles['dropzone'],
            })}>
                <div className={formStyles['base']}>
                    <div>
                        <div className={formStyles["drop-instructions"]}>
                            <span>Drop a font here</span>
                            <span>OR</span>
                            <span>
                                <input
                                    type="file"
                                    id="font-upload"
                                    name="font-upload"
                                    {...getInputProps()}
                                />
                                <button
                                    type='button'
                                    onClick={open}
                                >Browse</button>
                            </span>
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
                </div>

                {true &&
                    // {isDragActive &&
                    <div className={clsx(
                        formStyles['hover'],
                        isDragActive && formStyles['active'],
                        isDragReject && formStyles['error']
                    )}>
                        <div className={clsx(formStyles['message'])}>
                            <h2>{hoverTitle}</h2>
                            {hoverIcon &&
                                <Icon
                                    name={hoverIcon}
                                    className={formStyles['drop-icon']}
                                />
                            }
                            <p>{hoverMessage}</p>
                        </div>
                    </div>
                }
            </div>
            {(error && errorMessages.length > 0) && (
                <div className={formStyles['error-msg-container']}>
                    {errorMessages.map((err, idx) => (
                        <div
                            key={`err${idx}`}
                            className={formStyles['error-msg']}
                        >
                            {err}
                        </div>
                    ))
                    }
                </div>
            )}
        </form>
    );
}