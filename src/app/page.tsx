'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormState } from "react-dom";
import { getFontInfos, getFontOverrides } from './api/actions';
import * as fontkit from 'fontkit';
import { fetchFont, loadFont, getFontType, getFontName } from './_lib/fonts';
import { demoText } from './_lib/demoText';
import { URLValidator, listAcceptable } from './_lib/utils';
import styles from './page.module.scss'
import Image from 'next/image';
import TextInput from './components/form-components/textInput/textInput';
import Button from './components/form-components/button/button';
import Select from './components/form-components/select/select';
import RadioGroup from './components/form-components/radioGroup/radioGroup';
import TextTools from './components/textTools';
import FontFile from './components/fontFile';
import SubmitButton from './components/submitButton';

// See: https://stackoverflow.com/questions/52085454/typescript-define-a-union-type-from-an-array-of-strings
const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'] as const;
export type FontTypes = typeof fontTypes[number];

// In the current state (02 2024), Typescript interface for FontFace descriptor doesn't have the `sizeAdjust` property
interface MyFontFaceDescriptors extends FontFaceDescriptors {
  sizeAdjust?: string
}

type FontOverrides = {
  fullName: string,
  postscriptName: string,
  ascent: string,
  descent: string,
  lineGap: string,
  sizeAdjust: string,
}

type FontInfos = {
  fullName: string | null,
  familyName: string | null,
  type: FontTypes | null,
  size: string | null,
}

export default function Home() {
  const [fontInfos, setFontInfos] = useState<FontInfos>({
    fullName: null,
    familyName: null,
    type: null,
    size: null,
  });

  const [fontURL, setFontURL] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const temoinRef = useRef<HTMLDivElement>(null);
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
      "style": "'Times New Roman', times, serif"
    },
    "arial": {
      "text": "Arial",
      "style": "Arial, sans-serif"
    },
    "roboto": {
      "text": "Roboto",
      "style": "'Roboto Regular', roboto, sans-serif"
    }
  };
  let fallbackFontDefault = 'times';
  const [fallbackFontValue, setFallbackFontValue] = useState(fallbackFontDefault);
  const handleFallbackSelect = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    if (ev.target.value) setFallbackFontValue(ev.target.value);
  }

  useEffect(() => {
    document.body.style.setProperty('--fallback-family', fallbackFontValue);
  }, [fallbackFontValue])

  // `RadioGroup` for choosing the target language
  const languageOptions = [
    { id: 'lang-en', label: 'English', value: 'en' },
    { id: 'lang-fr', label: 'French', value: 'fr' }
  ]
  const languageOptionsDefault = 'en';
  const [targetedLanguage, setTargetedLanguage] = useState(languageOptionsDefault);
  const handleLanguageChoice = (ev: React.FormEvent<HTMLFieldSetElement>) => {
    const field = ev.currentTarget;
    const selected = field.querySelector('[type=radio]:checked') as HTMLInputElement;
    if (selected) {
      setTargetedLanguage(selected.value);
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
    if (fontInfos.fullName) {

      console.log(fontInfos)

      if (fontInfosDiv.current) {
        fontInfosDiv.current.classList.add('glow');
      }
      // if (temoinRef.current) {
      //   temoinRef.current.style.fontFamily = `'${fontInfos.fullName}'`;
      //   console.log('témoin-> done something')
      // }
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
        const fbFont = new FontFace(
          `fallback for ${fontInfos.fullName} (${fallbackFontValue})`,
          `url("${encodeURI('/Users/minim1/Library/Fonts/Roboto-Regular.ttf')}"))`,
          {
            "ascentOverride": overrides.ascent,
            "descentOverride": overrides.descent,
            "lineGapOverride": overrides.lineGap,
            // "sizeAdjust": overrides.sizeAdjust,
          } as MyFontFaceDescriptors
        );
        await fbFont.load();
        console.log(">>>>>>>>>>>>>", fbFont)
      } catch (err) {
        console.error(err);
      }
    }
    if (overrides && overrides.fullName) {
      loadFallBackFont(overrides);
    }
  }, [overridesFormState])

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    // Load the font & add it to the document
    try {
      let fontName = undefined;
      let theFont;
      if (fontURL) {
        fontName = getFontName(fontURL);
        if (!fontName) fontName = 'Web font';
        console.log("TuRL", fontName, fontURL)
        theFont = new FontFace(fontName, `url(${fontURL})`);
        console.log("theFont", theFont)
        await theFont.load();
      }
      if (fontFile) {
        fontName = fontFile.name.split('.')[0]; // file name without he extension
        const buffer = await fontFile.arrayBuffer();
        theFont = new FontFace(fontName, buffer);
        await theFont.load();
      }
      // load the font in the document
      if (theFont) {
        document.fonts.add(theFont);
        console.log("yo!", fontURL, theFont)
      }
      if (temoinRef.current) {
        temoinRef.current.style.fontFamily = `'${fontName}'`;
      }
    } catch (err) {

    }
  }

  return (
    <main className={styles.main}>
      <form
        id="select-font"
        className={styles["select-font"]}
        action={loadFormAction}
        onSubmit={handleSubmit}
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
          />
        </div>
      </form>

      <div className={styles['text-container']}>
        <TextTools />
        <div
          className={styles.temoin}
          ref={temoinRef}
          data-txt={demoText[targetedLanguage as keyof typeof demoText]}>
          {demoText[targetedLanguage as keyof typeof demoText]}
        </div>
      </div>
    </main>
  )
}