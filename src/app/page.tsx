'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useFormState } from "react-dom";
import styles from './page.module.scss'
import { getFontOverrides } from './api/actions';
import { fetchFont } from './_lib/fonts';
import { updateCustomProperty } from './_lib/utils';
import { FontOverridesType, overridesDefault } from './_lib/types';
import SectionCode from './components/sectionCode';
import OverridesForm from './components/overridesForm';
import LoadFontForm from './components/loadFontForm';
import { useUserData, useUserDataDispatch } from '@/app/context/userDataContext';
import { useFontInfos, useFontInfosDispatch } from '@/app/context/fontContext';
import { useOverrides, useOverridesDispatch } from '@/app/context/overridesContext';

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

// for server actions
const initialState = {
  success: false,
  message: null,
}

export default function Home() {

  const fontInfos = useFontInfos();
  const dispatchFontInfos = useFontInfosDispatch();

  const overridesSubmitRef = useRef<HTMLButtonElement>(null);

  const overrides = useOverrides();
  const dispatchOverrides = useOverridesDispatch();

  useEffect(() => {
    if (fontInfos.postscriptName) {
      // console.log("useEffect 52", fontInfos)

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
      // reset overrides
      dispatchOverrides({
        type: 'reset', payload: null
      })
      // reset fontInfos to default values
      dispatchFontInfos({
        type: 'reset', payload: null
      });
    }
  }, [fontInfos, dispatchFontInfos, dispatchOverrides]);

  // useEffect(() => {
  //   console.log("Page", overrides)
  // }, [overrides])

  // Server actions
  const [overridesFormState, overridesFormAction] = useFormState<any, FormData>(getFontOverrides, initialState);

  useEffect(() => {
    if (!overridesFormState.message) return;
    if (!overridesFormState.success && overridesFormState.message) {
      // TODO: gestion erreur en fonction de `.message`
      console.warn("There was an error", overridesFormState.message)
      return;
    }
    dispatchOverrides({
      type: 'setInfos',
      payload: overridesFormState.message
    })
  }, [overridesFormState, dispatchOverrides]);

  useEffect(() => {
    // console.log("overrides page", overrides)
    // console.log("fontInfos", fontInfos)
    const loadFallBackFont = async (overrides: FontOverridesType) => {
      try {
        const name = overrides.overridesName;
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
        updateCustomProperty('--fallback-family', name);
      } catch (err) {
        console.error(err);
      }
    }
    if (overrides.fullName !== '') {
      loadFallBackFont(overrides);
      // Scroll demo text into view
      const btn = overridesSubmitRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setTimeout(() => {
          const y = window.scrollY + rect.y - 16;
          window.scrollTo({
            top: y,
            behavior: "auto"
          });
        }, 250); // without this delay, scroll doesn't stop  in the right position (probably by React haven't finished reconstructing the DOM)
      }
    }
  }, [overrides])

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
        formAction={overridesFormAction}
      />

      <DynamicDemoText />

      {overrides.overridesName !== '' && (
        <SectionCode />
      )}
    </main>
  )
}