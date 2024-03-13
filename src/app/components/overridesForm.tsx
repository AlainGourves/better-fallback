'use client'
import { useRef, useEffect, forwardRef, useState } from 'react';
import formStyles from './overridesForm.module.scss';
import Select from './form-components/select/select';
import RadioGroup from './form-components/radioGroup/radioGroup';
import SubmitButton from './submitButton';
import { FallbackFontsType, LanguagesType } from '../../../types/types';
import { useUserData, useUserDataDispatch } from '@/app/context/userDataContext';
import { useFontInfos } from '../context/fontContext';
import { useOverrides, useOverridesDispatch } from '../context/overridesContext';

type OverridesFormProps = {
    formAction: string | ((formData: FormData) => void) | undefined,
    formKey: string,
}

type Ref = HTMLButtonElement;

export const fallbackFontsOptions = {
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


const OverridesForm = forwardRef<Ref, OverridesFormProps>(({ formAction, formKey }, overridesSubmitRef) => {

    const userData = useUserData();
    const dispatchUserData = useUserDataDispatch();

    const fontInfos = useFontInfos();
    const fontInfosDiv = useRef<HTMLDivElement>(null);

    const overrides = useOverrides();
    const dispatchOverrides = useOverridesDispatch();

    // `Select` for choosing fallback font
    const fallbackFontDefault = userData.fallbackFont ? userData.fallbackFont : 'times' as FallbackFontsType;

    let fallbackFontValue = fallbackFontDefault;

    const handleFallbackSelect = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        if (ev.target.value) {
            const prev = fallbackFontDefault;
            fallbackFontValue = ev.target.value as FallbackFontsType;
            if (fallbackFontValue !== prev) {
                // if the font changed, overrides need to be recomputed
                dispatchOverrides({
                    type: 'reset', payload: null
                })
                dispatchUserData({
                    type: 'changeFontFamily',
                    payload: {
                        value: ev.target.value as FallbackFontsType
                    }
                });
            }
        }
    }

    // `RadioGroup` for choosing the target language
    const languageOptions = [
        { id: 'lang-en', label: 'English', value: 'en' },
        { id: 'lang-fr', label: 'French', value: 'fr' }
    ]

    const handleLanguageChoice = (ev: React.ChangeEvent<HTMLFieldSetElement>) => {
        const field = ev.currentTarget;
        const selected = field.querySelector('[type=radio]:checked') as HTMLInputElement;
        if (selected) {
            if ((selected.value !== userData.language) && overrides.fullName) {
                // to display invitation to recompute overrides
                dispatchUserData({
                    type: 'changeLanguageAlert',
                    payload: { value: true }
                });
            }
            dispatchUserData({
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
            key={formKey}
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

                <input
                    type="hidden"
                    name="reqId"
                    value={formKey}
                />
            </div>

            <div className={formStyles['submit']}>
                <SubmitButton
                    ref={overridesSubmitRef}
                    id="proceed"
                    text='Proceed'
                    disabled={!fontInfos.fullName && !overrides.fullName}
                />
                {userData.languageChangedNotif && (
                    <div className={formStyles['note']}>Language changed, values need to be recomputed.</div>
                )}
            </div>
        </form>
    )
});

// To prevent eslint errors
// cf. https://stackoverflow.com/questions/67992894/component-definition-is-missing-display-name-for-forwardref
OverridesForm.displayName = 'OverridesForm';

export default OverridesForm;