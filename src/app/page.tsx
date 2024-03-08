'use client';
import React, { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useFormState } from "react-dom";
import styles from './page.module.scss'
import { getFontOverrides } from './api/actions';
import { fetchFont } from './_lib/fonts';
import { updateCustomProperty } from './_lib/utils';
import { FontOverridesType, FallbackFontsType } from '../../types/types';
import SectionCode from './components/sectionCode';
import OverridesForm from './components/overridesForm';
import LoadFontForm from './components/loadFontForm';
import { useUserData, useUserDataDispatch } from '@/app/context/userDataContext';
import { useFontInfos, useFontInfosDispatch } from '@/app/context/fontContext';
import { useOverrides, useOverridesDispatch } from '@/app/context/overridesContext';

// To make sure that the component only loads on the client (as it uses localStorage)
// cf: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic
import dynamic from 'next/dynamic';
import { userAgent } from 'next/server';
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
  success: 'unset',
  message: null,
}

export default function Home() {

  const userData = useUserData();
  const dispatchUserData = useUserDataDispatch();

  const fontInfos = useFontInfos();
  const dispatchFontInfos = useFontInfosDispatch();

  const overridesSubmitRef = useRef<HTMLButtonElement>(null);

  const overrides = useOverrides();
  const dispatchOverrides = useOverridesDispatch();

  // useFormState does not allow to reset the form state: it remains the same until the form is submitted again
  // Generating a new key to prevent useEffect from re-dispatching override infos of the last submit
  // See: https://stackoverflow.com/a/77816853/5351146
  const [formKey, setFormKey] = useState(() => nanoid());
  const updateFormKey = () => setFormKey(nanoid());

  //type Bob = {[key in FallbackFontsType]: FontOverridesType}
  const [bob, setBob] = useState<FontOverridesType[]>([]);

  const [isLocalStorageRead, setIsLocalStorageRead] = useState(false);


  useEffect(() => {
    // Load the tested font in the document
    if (fontInfos.postscriptName) {
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
    // Reset values when the tested font is deleted
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


  // Server actions
  const [overridesFormState, overridesFormAction] = useFormState<any, FormData>(getFontOverrides, initialState);

  useEffect(() => {
    // Handle server response
    if (!overridesFormState.message) return;
    if (overridesFormState.status === 'error') {
      // TODO: gestion erreur en fonction de `.message`
      console.warn("There was an error", overridesFormState.message)
      return;
    }

    if (overridesFormState.status === 'success' && overridesFormState.id === formKey) {
      setBob(structuredClone(overridesFormState.message)); // make a deep copy of the result
      // get the right object from response
      const payload = overridesFormState.message.find((o: FontOverridesType) => o.name === userData.fallbackFont);
      dispatchOverrides({
        type: 'setInfos',
        payload
      })
      // Update formKey to expire server response
      updateFormKey();
    }
  }, [overridesFormState, dispatchOverrides]);

  useEffect(() => {
    // Update when selected fallback font changes
    // providing that the selected language doesn't change (in which case it requires a new computation of the values)
    const font = userData.fallbackFont;
    if (font !== overrides.name && bob.length > 0) {
      const newOverrides = bob.find((obj: FontOverridesType) => obj.name === font);
      if (newOverrides) {
        dispatchOverrides({
          type: 'setInfos',
          payload: newOverrides
        })
      }
    }
  }, [
    userData.fallbackFont,
    dispatchOverrides,
    overrides.name,
    bob
  ]);

  useEffect(() => {
    // When the language's choice changes, it needs re-computation of all overrides
    setBob([]);
  }, [userData.language]);

  useEffect(() => {
    // Reset current overrides to default values
    if (bob.length === 0 && fontInfos.fullName) {
      dispatchOverrides({
        type: 'reset', payload: null
      });
    }
  }, [bob, fontInfos.fullName]);


  useEffect(() => {
    // Load fallback font in the document with metrics overrides
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
    // Save to localStorage
    if (isLocalStorageRead) {
      // Make sure that localStorage has been read before writing to it
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
        formKey={formKey}
      />

      <DynamicDemoText />

      {(bob.length > 0) && (
        <SectionCode code={bob} />
      )}
    </main>
  )
}