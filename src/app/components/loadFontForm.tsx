'use client';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useFormState } from 'react-dom';
import formStyles from './loadFontForm.module.scss';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { useDropzone, FileRejection } from 'react-dropzone';
import { getFontInfos } from '@/app/api/actions';
import { URLValidator, checkProtocol } from '../_lib/utils';
import { fontTypes, FontTypes } from '../../../types/types'
import { type IconName } from '../../../types/name';
import { useFontInfos, useFontInfosDispatch } from '@/app/context/fontContext';
import FontFile from './fontFile';
import TextInput from './form-components/textInput/textInput';
import SubmitButton from './submitButton';
import { Icon } from './form-components/Icon';


export default function LoadFontForm() {
    const fontInfos = useFontInfos();
    const dispatchFontInfos = useFontInfosDispatch();

    // Error handling
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const resetErrors = useCallback(() => {
        setErrorMessages([]);
        setError(false);
    }, [setError, setErrorMessages]);

    const formRef = useRef<HTMLFormElement>(null);
    const urlRef = useRef<HTMLInputElement>(null);

    // useFormState does not allow to reset the form state: it remains the same until the form is posted again, especially error messages keep being displayed
    // Generating a new key (for eg. when a "bad" URL is erased) allows to know when to display error message, or not
    // See: https://stackoverflow.com/a/77816853/5351146
    const [formKey, setFormKey] = useState(() => nanoid());
    const updateFormKey = useCallback(() => setFormKey(nanoid()), [setFormKey]);

    // Input[text] for font URL
    const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => {
        let val = '';
        // Adds a 'https://' before if missing
        if (ev.target.value !== '') val = checkProtocol(ev.target.value);
        if (URLValidator(val) || val === '') {
            urlRef.current?.setCustomValidity(''); // remove :invalid state if present
        }
        dispatchFontInfos({
            type: "setURL",
            payload: {
                value: val
            }
        });
    };

    // 'X' buttons to remove font file
    const handleRemoveFontFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (formRef.current) {
            formRef.current.reset()
        }
        dispatchFontInfos({
            type: "reset",
            payload: null
        });
        if (error === true) resetErrors();
        ev.preventDefault();
        ev.stopPropagation();
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
            // Add the file to the input[file] element (react-dropzone doesn't do it)
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(acceptedFiles[0]);
            if (formRef.current) {
                const input: HTMLInputElement | null = formRef.current.querySelector('input[type=file]');
                if (input) {
                    input.files = dataTransfer.files;
                }
            }
            if (urlRef.current){
                urlRef.current.value = '';
            }
            dispatchFontInfos({
                type: "setFile",
                payload: {
                    value: acceptedFiles[0]
                }
            });
            resetErrors();
            if (formRef.current) formRef.current.requestSubmit();
        }
        if (fileRejections.length) {
            const codes = new Set();
            fileRejections.forEach((r) => {
                codes.add(r.errors[0].code);
            });
            let theMessages: string[] = [];
            Array.from(codes).forEach((err) => {
                let msg = '';
                switch (err) {
                    case 'file-invalid-type':
                        msg = `Only files of MIME type: ${fontTypes.join(', ')}.`;
                        break;
                    case 'file-too-large':
                        msg = `Files must be less than 2Mb, yours is suspiciously big!`;
                        break;
                    case 'too-many-files':
                        msg = `Only one font at a time!`;
                        break;
                    default:
                        msg = 'There was a problem, the nature of which is unclear…';
                        break;
                }
                theMessages.push(msg);
            })
            setError(true);
            setErrorMessages(errorMessages => [
                ...errorMessages,
                ...theMessages
            ]);
        }
    }, [dispatchFontInfos, resetErrors]);

    const maxFileSize = 1024 * 1024 * 2; // 2 megabytes max font size

    // const onFileDialogOpen = () => {
    // };

    // const onDragEnter = () => {
    // }

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
        // onFileDialogOpen: onFileDialogOpen,
        // onDragEnter: onDragEnter,
        maxFiles: 1,
        multiple: false,
        maxSize: maxFileSize,
        autoFocus: true,
        noClick: true, // prevent open dialog from opening twice
    });

    let hoverIcon: IconName | undefined = undefined;
    let hoverTitle = ''
    let hoverMessage = '';
    if (isDragAccept) {
        hoverIcon = 'download';
        hoverTitle = 'Drop it';
        hoverMessage = `(like it's hot!)`;
    }
    if (isDragReject) {
        hoverIcon = 'alert-triangle';
        hoverTitle = 'Attention!';
        hoverMessage = `There's an issue with what you are dragging, drop it to see the origin.`;
    }

    // Server actions --------------------------------
    const initialState = {
        status: 'unset',
        message: null,
    }

    const [loadFormState, loadFormAction] = useFormState<any, FormData>(getFontInfos, initialState);

    useEffect(() => {
        if (!formRef.current) return;
        if (!loadFormState.message) return;
        if (loadFormState.status === 'success' && loadFormState.id === formKey) {
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
            updateFormKey();
        }
        if (loadFormState.status === 'error' && loadFormState.id === formKey) {
            // Make sure an error message is only added once
            const errMsgs = Array.from(new Set([...errorMessages, loadFormState.message]));
            if (errMsgs.length !== errorMessages.length) {
                setError(true);
                setErrorMessages(prevErrMsgs => errMsgs);
            }
            updateFormKey();
        }
    }, [
        loadFormState,
        errorMessages,
        formKey,
        dispatchFontInfos,
        resetErrors,
        updateFormKey
    ]);

    return (

        <section  {...getRootProps({
            className: formStyles['dropzone'],
        })}>
            <form
                key={formKey}
                ref={formRef}
                id="select-font"
                className={formStyles["select-font"]}
                action={loadFormAction}
                onReset={updateFormKey}
            >
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
                                <input
                                    type="hidden"
                                    name="reqId"
                                    value={formKey}
                                />
                                <button
                                    type='button'
                                    onClick={open}
                                    className={clsx('agf-component', formStyles['browse'])}
                                >Browse</button>
                            </span>
                            {fontInfos.fullName && (
                                <FontFile
                                    name={fontInfos.fullName}
                                    onClick={handleRemoveFontFile}
                                />
                            )}
                        </div>
                    </div>
                    <div>OR</div>
                    {(error && errorMessages.length) && (
                        <div className={formStyles['error-msg-container']}>
                            {errorMessages.map((err, idx) => (
                                <div
                                    key={`err${idx}`}
                                    className={formStyles['error-msg']}
                                >
                                    <svg>
                                        <use href='#alert-triangle' />
                                    </svg>
                                    <p
                                        dangerouslySetInnerHTML={{ __html: err }}
                                    />
                                </div>
                            ))
                            }
                        </div>
                    )}
                    <div className={formStyles['input-url']}>
                        <TextInput
                            ref={urlRef}
                            id={'fontUrl'}
                            type={'text'}
                            value={fontInfos.url ? fontInfos.url : ''}
                            placeholder={'https://example.com/my-font.ttf'}
                            onChange={handleFontURL}
                            title='Erase field'
                            onClick={handleRemoveFontFile}
                        />
                        <SubmitButton
                            id="select-font-submit"
                            text={'Load the font'}
                            classAdd={'outlined'}
                            disabled={!fontInfos.url && !fontInfos.file}
                        />
                    </div>
                </div>

                {isDragActive &&
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
            </form>
        </section>
    );
}