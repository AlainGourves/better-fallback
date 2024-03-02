import { useCallback, useState, useRef, useEffect } from 'react';
import { useFormState } from 'react-dom';
import formStyles from './loadFontForm.module.scss';
import clsx from 'clsx';
import { getFontInfos } from '@/app/api/actions';
import Image from 'next/image';
import FontFile from './fontFile';
import TextInput from './form-components/textInput/textInput';
import SubmitButton from './submitButton';
import { URLValidator, listAcceptable } from '../_lib/utils';
import { fontTypes, FontTypes } from '@/app/_lib/types'
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
    const [errorMessage, setErrorMessage] = useState('');
    const resetErrorMessages = () => {
        setError(false);
        setErrorCodes([]);
    }

    const urlRef = useRef<HTMLInputElement>(null);

    // Input[File] for selecting a font
    const handleFontFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (!ev.target.files) return;
        dispatchFontInfos({
            type: "setFile",
            payload: {
                value: ev.target.files[0]
            }
        })
    }

    // 'X' button to remove font file
    const handleRemoveFontFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
        dispatchFontInfos({
            type: "reset",
            payload: null
        });
        if (error) resetErrorMessages();
        ev.preventDefault();
        ev.stopPropagation();
    }

    // Input[text] for font URL
    const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
            setFontInfos({
                ...fontInfos,
                file: acceptedFiles[0],
                name: acceptedFiles[0].name,
            })
        }
        if (fileRejections.length) {
            setError(true);
            fileRejections.forEach((r) => {
                setErrorCodes(errorCodes => [...errorCodes, r.errors[0].code])
            });
        }
    }, [fontInfos]);

    const maxFileSize = 1024 * 1024 * 2; // 2 megabytes max font size

    const onFileDialogOpen = useCallback(() => {
        if (error) resetErrorMessages();
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
    const errorMessages: string[] | undefined = [];
    if (errorCodes.length) {
        // make errors' type unique
        const theErrors = new Set(errorCodes);
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
            errorMessages.push(msg);
        })
    }

    useEffect(() => {
        if (isDragActive) {
            resetErrorMessages();
        }
    }, [isDragActive]);

    useEffect(() => {
        if (!error) setErrorMessage('');
    }, [error]);


    // Server actions --------------------------------
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
    }, [loadFormState, dispatchFontInfos]);

    return (
        <form
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
                            {fontInfos.name && (
                                <FontFile
                                    name={fontInfos.name}
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
                            value=''
                            placeholder={'Paste a font URL'}
                            onChange={(e) => console.log(e.target.value)}
                            title='Erase field'
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
                    {errorMessages.map((err) => (
                        <p
                            key={"hu" + Math.random()}
                            className={formStyles['error-msg']}
                        >
                            {err}
                        </p>
                    ))}
                </div>
            )}
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