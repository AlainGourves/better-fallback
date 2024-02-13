import { useState, useRef, useEffect } from 'react';
import formStyles from './overridesForm.module.scss';
import Select from './form-components/select/select';
import RadioGroup from './form-components/radioGroup/radioGroup';
import SubmitButton from './submitButton';
import { FontInfosType, FallbackFontsType, LanguagesType } from '../_lib/types';


type OverridesFormProps = {
    fontInfos: FontInfosType,
    formAction: string | ((formData: FormData) => void) | undefined
}

export default function OverridesForm({ fontInfos, formAction }: OverridesFormProps) {

    const fontInfosDiv = useRef<HTMLDivElement>(null);


    // `Select` for choosing fallback font
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
    let fallbackFontDefault = 'times';
    const [fallbackFontValue, setFallbackFontValue] = useState(fallbackFontDefault);
    const handleFallbackSelect = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        if (ev.target.value) setFallbackFontValue(ev.target.value);
    }

    useEffect(() => {
        const family = fallbackFontsOptions[fallbackFontValue as FallbackFontsType].style;
        if (family) {
            document.body.style.setProperty('--fallback-family', family);
        }
    }, [fallbackFontValue])

// `RadioGroup` for choosing the target language
const languageOptions = [
    { id: 'lang-en', label: 'English', value: 'en' },
    { id: 'lang-fr', label: 'French', value: 'fr' }
  ]
  const languageOptionsDefault = 'en';
  const [targetedLanguage, setTargetedLanguage] = useState<LanguagesType>(languageOptionsDefault);
  const handleLanguageChoice = (ev: React.FormEvent<HTMLFieldSetElement>) => {
    const field = ev.currentTarget;
    const selected = field.querySelector('[type=radio]:checked') as HTMLInputElement;
    if (selected) {
      setTargetedLanguage(selected.value as LanguagesType);
    }
  }

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
                    defaultValue={fallbackFontDefault}
                    onChange={handleFallbackSelect}
                />

                <RadioGroup
                    groupName='targetLanguage'
                    defaultValue={languageOptionsDefault}
                    radios={languageOptions}
                    onInput={handleLanguageChoice}
                    label='Lang.'
                />
            </div>

            <div>
                <SubmitButton
                    id="proceed"
                    text='Proceed'
                    disabled={!fontInfos}
                />
            </div>
        </form>
    )
}