'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormState } from "react-dom";
import { getFontInfos, getFontOverrides } from './api/actions';
import { fetchFont } from './_lib/fonts';
import { URLValidator, listAcceptable } from './_lib/utils';
import styles from './page.module.scss'
import Image from 'next/image';
import TextInput from './components/form-components/textInput/textInput';
import FontFile from './components/fontFile';
import SubmitButton from './components/submitButton';
import SectionCode from './components/sectionCode';
import { UserDataProvider, useUserData, useUserDataDispatch } from '@/app/context/userData';
import { FontTypes, FallbackFontsType, LanguagesType, FontOverridesType, FontInfosType } from './_lib/types';

// To make sure that the component only loads on the client (as it uses localStorage)
// cf: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic
import dynamic from 'next/dynamic';
import OverridesForm from './components/overridesForm';
const DynamicDemoText = dynamic(() => import('./components/demoText'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'];

// In the current state (02 2024), Typescript interface for FontFace descriptor doesn't have the `sizeAdjust` property
interface MyFontFaceDescriptors extends FontFaceDescriptors {
  sizeAdjust?: string
}

export default function Home() {
  const [fontInfos, setFontInfos] = useState<FontInfosType>({
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

  // Error handling
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!error) setErrorMessage('');
  }, [error]);

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

      // Load the font
      loadFontInDocument();
      // Update demo text font
      document.body.style.setProperty('--tested-font', `'${fontInfos.postscriptName}'`);
    };
  }, [fontInfos, fontFile, fontURL]);

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
    const loadFallBackFont = async (overrides: FontOverridesType) => {
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
  }, [overridesFormState, fontInfos])

  const userData = useUserData();
  const dispatch = useUserDataDispatch();
  console.log('dispatch page', dispatch)


  useEffect(() => {
    // Load user settings from localStorage
    if ('localStorage' in window) {
      console.log("in useEffect", dispatch)

      const storage = localStorage.getItem('userSettings');
      if (storage) {
        const settings = JSON.parse(storage);
        console.log(">>>>>settings", settings, dispatch)
        dispatch({
          type: "changeAll",
          payload: settings
        });
      }
    }
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("koukou", userData)
  //   // if (JSON.stringify(userData) !== JSON.stringify(defaultUserData)) {
  //     if ('localStorage' in window) {
  //       localStorage.setItem('userSettings', JSON.stringify(userData));
  //       console.log("koukou 2")
  //     }
  //   // }

  // }, [userData]);


  useEffect(() => {
    // if (JSON.stringify(userData) !== JSON.stringify(defaultUserData)) {
        console.log("save to localStorage from page !!!")
    if ('localStorage' in window) {
        localStorage.setItem('userSettings', JSON.stringify(userData));
    }
    // }

}, [userData]);


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
            <div className={styles['error-msg-container']}>
              <div className={styles['error-msg']}>
                <h3>A problem occurred!</h3>
                {loadFormState.message}
              </div>
            </div>
          )}
        </form>

        <OverridesForm
          fontInfos={fontInfos}
          formAction={overridesFormAction}
          />

        <DynamicDemoText
          lang={userData.language}
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