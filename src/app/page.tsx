'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormState } from "react-dom";
import { getFontInfos, getFontOverrides } from './api/actions';
import { fetchFont } from './_lib/fonts';
import { URLValidator, listAcceptable } from './_lib/utils';
import styles from './page.module.scss'
import Image from 'next/image';
import TextInput from './components/form-components/textInput/textInput';
import Select from './components/form-components/select/select';
import RadioGroup from './components/form-components/radioGroup/radioGroup';
import FontFile from './components/fontFile';
import SubmitButton from './components/submitButton';
import SectionCode from './components/sectionCode';
import { UserDataProvider, useUserData, defaultUserData } from './components/userData';

// To make sure that the component only loads on the client (as it uses localStorage)
// cf: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic
import dynamic from 'next/dynamic';
const DynamicDemoText = dynamic(() => import('./components/demoText'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

// See: https://stackoverflow.com/questions/52085454/typescript-define-a-union-type-from-an-array-of-strings
const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'] as const;
export type FontTypes = typeof fontTypes[number];

// In the current state (02 2024), Typescript interface for FontFace descriptor doesn't have the `sizeAdjust` property
interface MyFontFaceDescriptors extends FontFaceDescriptors {
  sizeAdjust?: string
}

const fallbackFonts = ['arial', 'roboto', 'times'] as const;
export type FallbackFontsType = typeof fallbackFonts[number];

const languages = ['en', 'fr'] as const;
export type LanguagesType = typeof languages[number];

export type FontOverrides = {
  fullName: string,
  postscriptName: string,
  file: string,
  ascent: string,
  descent: string,
  lineGap: string,
  sizeAdjust: string,
}

type FontInfos = {
  fullName: string | null,
  postscriptName: string | null,
  familyName: string | null,
  type: FontTypes | null,
  size: string | null,
}

export default function Home() {
  const [fontInfos, setFontInfos] = useState<FontInfos>({
    fullName: null,
    postscriptName: null,
    familyName: null,
    type: null,
    size: null,
  });

  const [fontURL, setFontURL] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [fallbackFamilyName, setFallbackFamilyName] = useState<string | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const fontInfosDiv = useRef<HTMLDivElement>(null);

  // Error handling
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!error) setErrorMessage('');
  }, [error]);


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
  // button with an 'X' to erase TextInpu
  const eraseTextInput = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setFontURL('');
    if (error === true) setError(false);
  }

  useEffect(() => {
    if (fontInfos.postscriptName) {
      console.log(fontInfos)

      const loadFontInDocument = async () => {
        try {
          let theFile: null | File;
          if (fontURL) {
            theFile = await fetchFont(fontURL, fontInfos.postscriptName as string);
          } else {
            theFile = fontFile;
          }
          if (theFile) {
            const buff = await theFile.arrayBuffer();
            const font = new FontFace(fontInfos.postscriptName as string, buff);
            await font.load();
            document.fonts.add(font)
          }

        } catch (err) {
          throw new Error(`Problem loading font '${fontInfos.fullName}'. ${err}`);
        }
      }

      if (fontInfosDiv.current) {
        fontInfosDiv.current.classList.add('glow');
      }

      // Load the font
      loadFontInDocument();
      // Update demo text font
      document.body.style.setProperty('--tested-font', `'${fontInfos.postscriptName}'`);
    };
  }, [fontInfos]);

  // Server actions
  const initialState = {
    success: false,
    message: null,
  }
  const [loadFormState, loadFormAction] = useFormState<any, FormData>(getFontInfos, initialState);

  useEffect(() => {
    if (loadFormState.success) {
      setFontInfos((fontInfos) => ({
        ...fontInfos,
        fullName: loadFormState.message?.fullName,
        postscriptName: loadFormState.message?.postscriptName,
        familyName: loadFormState.message?.familyName,
        type: loadFormState.message?.type,
        size: loadFormState.message?.size
      }));
    }
  }, [loadFormState]);

  const [overridesFormState, overridesFormAction] = useFormState<any, FormData>(getFontOverrides, initialState);

  useEffect(() => {
    const overrides = overridesFormState.message;
    console.log("overrides", overrides)
    const loadFallBackFont = async (overrides: FontOverrides) => {
      try {
        const name = `fallback for ${fontInfos.postscriptName}`;
        setFallbackFamilyName(name);
        const path = encodeURI(`/${overrides.file}`);
        console.log(name, path, `url("${path}")`)
        const fbFont = new FontFace(
          name,
          `url("${path}")`,
          {
            "ascentOverride": overrides.ascent,
            "descentOverride": overrides.descent,
            "lineGapOverride": overrides.lineGap,
            "sizeAdjust": overrides.sizeAdjust,
          } as MyFontFaceDescriptors
        );
        await fbFont.load();
        document.fonts.add(fbFont);
        document.body.style.setProperty('--fallback-family', name);

        console.log(">>>> Fallback loaded & added")
      } catch (err) {
        console.error(err);
      }
    }
    if (overrides && overrides.fullName) {
      loadFallBackFont(overrides);
    }
  }, [overridesFormState, fallbackFontValue, fontInfos])

  const userData = useUserData();

  useEffect(() => {
    // Load user settings from localStorage

    // Before unmounting component: save user settings to localStorage
    return () => {
      if ('localStorage' in window) {
        localStorage.setItem('userSettings', JSON.stringify(userData));
      }
    }
  }, [])

  return (
    <UserDataProvider value={userData}>

      <main className={styles.main}>
        <form
          id="select-font"
          className={styles["select-font"]}
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
            <div className={styles["drop-instructions"]}>
              <span>Drop a font here</span>
              <span>OR</span>
              <label htmlFor='font-upload'>
                Browse
                <input
                  type="file"
                  id="font-upload"
                  name="font-upload"
                  accept={listAcceptable([...fontTypes])}
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
            <div className={styles['error-msg-container']}>
              <div className={styles['error-msg']}>
                <h3>A problem occurred!</h3>
                {loadFormState.message}
              </div>
            </div>
          )}
        </form>

        <form
          className={styles['font-settings']}
          action={overridesFormAction}
        >
          <div
            className={styles['font-infos']}
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

          <div className={styles['fallback-font']}>
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

        <DynamicDemoText
          lang={targetedLanguage as LanguagesType}
        />

        {fallbackFamilyName && (
          <SectionCode
            fallbackName={fallbackFamilyName}
            overrides={overridesFormState?.message}
          />
        )}
      </main>
    </UserDataProvider>

  )
}