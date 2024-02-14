import { useState, useRef, useEffect } from 'react';
import formStyles from './overridesForm.module.scss';
import Select from './form-components/select/select';
import RadioGroup from './form-components/radioGroup/radioGroup';
import SubmitButton from './submitButton';
import { FontInfosType, FallbackFontsType, LanguagesType } from '../_lib/types';
import { useUserData, useUserDataDispatch } from '@/app/context/userData';

type OverridesFormProps = {
    fontInfos: FontInfosType,
    formAction: string | ((formData: FormData) => void) | undefined,
}

const fallbackFontsOptions = {
    "times": {
        "text": "Times New Roman",
        "style": "'Times New Roman', TimesNewRomanPSMT, times"
    },
    "arial": {
        "text": "Arial",
        "style": "Arial, ArialMT"
    },
    "roboto": {
        "text": "Roboto",
        "style": "'Roboto Regular', Roboto-Regular, Roboto"
    }
};


export default function OverridesForm({ fontInfos, formAction }: OverridesFormProps) {

    const userData = useUserData();
    const dispatch = useUserDataDispatch();

    const fontInfosDiv = useRef<HTMLDivElement>(null);

    // `Select` for choosing fallback font
    let fallbackFontDefault = userData.fallbackFont ? userData.fallbackFont : 'times' as FallbackFontsType;

    const [fallbackFontValue, setFallbackFontValue] = useState(fallbackFontDefault);

    const handleFallbackSelect = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        if (ev.target.value) setFallbackFontValue(ev.target.value as FallbackFontsType);
        dispatch({
            type: 'changeFontFamily',
            payload: {
                value: ev.target.value as FallbackFontsType
            }
        });
    }

    useEffect(() => {
        const family = fallbackFontsOptions[userData.fallbackFont as FallbackFontsType].style;
        if (family && 'document' in window) {
            document.body.style.setProperty('--fallback-family', family);
        }
    }, [fallbackFontValue, userData])

    // `RadioGroup` for choosing the target language
    const languageOptions = [
        { id: 'lang-en', label: 'English', value: 'en' },
        { id: 'lang-fr', label: 'French', value: 'fr' }
    ]

    const handleLanguageChoice = (ev: React.ChangeEvent<HTMLFieldSetElement>) => {
        const field = ev.currentTarget;
        const selected = field.querySelector('[type=radio]:checked') as HTMLInputElement;
        if (selected) {
            dispatch({
                type: 'changeLanguage',
                payload: { value: selected.value as LanguagesType }
            });
        }
    }

    useEffect(() => {
        if (fontInfos.fullName && fontInfosDiv.current) {
            fontInfosDiv.current.classList.add('glow');
        }
    }, [fontInfos])

    return (
        <form
            className={formStyles['font-settings']}
            action={formAction}
        >
            <div
                className={formStyles['font-infos']}
                ref={fontInfosDiv}
                onAnimationEnd={e => {
                    const target = e.target as HTMLElement;
                    if (target.classList.contains('glow')) target.classList.remove('glow');
                }}
            >
                <h3>Selected Font</h3>
                <div>
                    <dl>
                        <dt>Name</dt>
                        <dd>{fontInfos.fullName && fontInfos.fullName}</dd>
                    </dl>
                    <dl>
                        <dt>Family</dt>
                        <dd>{fontInfos.familyName && fontInfos.familyName}</dd>
                    </dl>
                    <dl>
                        <dt>Type</dt>
                        <dd>{fontInfos.type && fontInfos.type}</dd>
                    </dl>
                    <dl>
                        <dt>Size</dt>
                        <dd>{fontInfos.size && fontInfos.size}</dd>
                    </dl>
                </div>
            </div>

            <div className={formStyles['fallback-font']}>
                <h3>Fallback Font</h3>
                <Select
                    id='fallbackFontSelect'
                    label='Family'
                    options={fallbackFontsOptions}
                    value={fallbackFontDefault}
                    onChange={handleFallbackSelect}
                />

                <RadioGroup
                    groupName='targetLanguage'
                    selected={userData.language}
                    radios={languageOptions}
                    onChange={handleLanguageChoice}
                    label='Lang.'
                />
            </div>

            <div>
                <SubmitButton
                    id="proceed"
                    text='Proceed'
                    disabled={!fontInfos.fullName}
                />
            </div>
        </form>
    )
}