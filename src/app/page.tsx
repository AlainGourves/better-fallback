'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormState } from "react-dom";
import styles from './page.module.scss'
import { getFontOverrides } from './api/actions';
import { fetchFont } from './_lib/fonts';
import { updateCustomProperty } from './_lib/utils';
import { FontOverridesType } from './_lib/types';
import SectionCode from './components/sectionCode';
import OverridesForm from './components/overridesForm';
import LoadFontForm from './components/loadFontForm';
import { useUserData, useUserDataDispatch } from '@/app/context/userData';
import { useFontInfos, useFontInfosDispatch } from '@/app/context/fontContext';

// To make sure that the component only loads on the client (as it uses localStorage)
// cf: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic
import dynamic from 'next/dynamic';
const DynamicDemoText = dynamic(() => import('./components/demoText'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

// In the current state (02 2024), Typescript interface for FontFace descriptor doesn't have the `sizeAdjust` property
interface MyFontFaceDescriptors extends FontFaceDescriptors {
  sizeAdjust?: string
}

export default function Home() {

  const fontInfos = useFontInfos();
  const dispatchFontInfos = useFontInfosDispatch();

  const [fallbackFamilyName, setFallbackFamilyName] = useState<string | null>(null);

  const overridesSubmitRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (fontInfos.postscriptName) {
      console.log("useEffect 36", fontInfos)

      const loadFontInDocument = async () => {
        try {
          let theFile: null | File;
          if (fontInfos.url) {
            theFile = await fetchFont(fontInfos.url, fontInfos.postscriptName as string);
          } else {
            theFile = fontInfos.file;
          }
          if (theFile) {
            const buff = await theFile.arrayBuffer();
            const font = new FontFace(fontInfos.postscriptName as string, buff);
            await font.load();
            document.fonts.add(font);
          }

        } catch (err) {
          throw new Error(`Problem loading font '${fontInfos.fullName}'. ${err}`);
        }
      }

      // Load the font
      loadFontInDocument();
      // Update demo text font
      updateCustomProperty('--tested-font', `${fontInfos.postscriptName}`);
    };
  }, [fontInfos]);

  useEffect(() => {
    if (!fontInfos.url && !fontInfos.file) {
      // reset fontInfos to default values
      dispatchFontInfos({
        type: 'reset', payload: null
      });
    }
  }, [fontInfos, dispatchFontInfos]);

  // Server actions
  const initialState = {
    success: false,
    message: null,
  }

  const [overridesFormState, overridesFormAction] = useFormState<any, FormData>(getFontOverrides, initialState);

  useEffect(() => {
    const overrides = overridesFormState.message;
    console.log("overrides", overrides)
    console.log("fontInfos", fontInfos)
    const loadFallBackFont = async (overrides: FontOverridesType) => {
      try {
        const name = overrides.overridesName;
        setFallbackFamilyName(name);
        const path = encodeURI(`/${overrides.file}`);
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
        overrides.isActive = true;// TODO: set state
        updateCustomProperty('--fallback-family', name);
      } catch (err) {
        console.error(err);
      }
    }
    if (overrides && overrides.fullName) {
      loadFallBackFont(overrides);
      // Scroll demo text into view
      if (fontInfos.fullName) {
        const btn = overridesSubmitRef.current;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          setTimeout(() => {
            const y = window.scrollY + rect.y - 16;
            window.scrollTo({
              top: y,
              behavior: "auto"
            });
            console.log('yo!')
          }, 250); // without this delay, scroll doesn't stop  in the right position (probably by React haven't finished reconstructing the DOM)
        }
      }
    }
  }, [overridesFormState, fontInfos])

  const [isLocalStorageRead, setIsLocalStorageRead] = useState(false);
  const userData = useUserData();
  const dispatchUserData = useUserDataDispatch();

  useEffect(() => {
    // Load user settings from localStorage
    if ('localStorage' in window) {

      const storage = localStorage.getItem('userSettings');
      if (storage) {
        const settings = JSON.parse(storage);
        dispatchUserData({
          type: "changeAll",
          payload: settings
        });
      }
      // localStorage has been read, even if it was empty
      setIsLocalStorageRead(true);
    }
  }, [dispatchUserData]);

  useEffect(() => {
    if (isLocalStorageRead) {
      if ('localStorage' in window) {
        localStorage.setItem('userSettings', JSON.stringify(userData));
      }
    }

  }, [userData, isLocalStorageRead]);

  return (
    <main className={styles.main}>

      <LoadFontForm />

      <OverridesForm
        ref={overridesSubmitRef}
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
  )
}