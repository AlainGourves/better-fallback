'use client'
// localStorage only exists in browser !

import React, { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import styles from './demoText.module.scss';
import TextTools from "./textTools";
import { dummyText } from '@/app/_lib/dummyText';
import { useUserDataDispatch, useUserData } from "@/app/context/userDataContext";
import Switch from "./form-components/switch/switch";
import { updateCustomProperty } from "../_lib/utils";
import { fallbackFontsOptions } from './overridesForm';
import { FallbackFontsType, FontOverridesType, overridesDefault } from '../../../types/types'

type DemoTextProps = {
  currentOverrides: FontOverridesType
}

export default function DemoText({ currentOverrides }: DemoTextProps) {

  const demoText = useRef<HTMLDivElement | null>(null);

  const userData = useUserData();
  const dispatchUserData = useUserDataDispatch();

  const [showUserTextSwitch, setShowUserTextSwitch] = useState(userData.showUserText);

  const lang = userData.language ? userData.language : 'en';
  const text = dummyText[(lang as keyof typeof dummyText)];
  let userText = (userData.userText) ? userData.userText : '';

  // To know when DemoText is edited by the user
  const [isEditing, setIsEditing] = useState(false);

  const handleShowUserTextSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setShowUserTextSwitch(ev.target?.checked);
    dispatchUserData({
      type: 'showDemoText',
      payload: {
        value: ev.target?.checked,
      }
    });
  }

  // Handle wether the text is displayed with or without Fonts Metrics Overrides
  const [displayFMO, setDisplayFMO] = useState(false);
  const handleSwitchFMO = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayFMO(ev.target.checked);
  }

  useEffect(() => {
    if (!currentOverrides.name) return;
    setDisplayFMO(currentOverrides.isActive);
  }, [currentOverrides.name, currentOverrides.isActive]);

  // --fallback-family variations
  const setBaseFallback = useCallback(() => {
    const family = fallbackFontsOptions[userData.fallbackFont as FallbackFontsType]?.style;
    if (family && 'document' in window) {
      updateCustomProperty('--fallback-family', family);
    }
  }, [userData.fallbackFont]);

  useEffect(() => {
    // When FMO switch value changes
    if (currentOverrides.name) {
      let val;
      if (displayFMO) {
        val = currentOverrides.overridesName;
      } else {
        val = fallbackFontsOptions[currentOverrides.name as FallbackFontsType]?.style;
      }
      if (val && 'document' in window) {
        updateCustomProperty('--fallback-family', val);
      }
    } else {
      setBaseFallback();
    }
  }, [displayFMO, currentOverrides, setBaseFallback]);


  // ContentEditable DIV ---------------------------
  const handleFocus = (ev: React.FormEvent<HTMLDivElement>) => {
    if (showUserTextSwitch) setIsEditing(true);
  }

  // Save the user text when the DIV has been edited
  const saveUserText = (ev: React.FocusEvent<HTMLDivElement, Element>) => {
    setIsEditing(false);
    // Important ! contentEditable attribute is enumerated, not a Boolean
    // its value is a string, not a bool
    if (demoText.current?.contentEditable === 'true') {
      const newText = (ev.currentTarget.innerText) ? ev.currentTarget.innerText.trim() : '';
      dispatchUserData({
        type: 'changeDemoText',
        payload: { value: newText }
      });
    }
  }

  // Captures the `paste` event to only get plain text instead of HTML rich content
  const pasteUserText = (ev: React.ClipboardEvent<HTMLDivElement>) => {
    ev.preventDefault();
    // get text representation of clipboard
    const text = (ev.clipboardData).getData("text/plain");
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
  }

  return (
    <section className={styles['text-container']}>
      <TextTools
        checked={showUserTextSwitch}
        onChange={handleShowUserTextSwitch}
      />

      {(currentOverrides && currentOverrides.overridesName !== '' && !isEditing) &&
        <div className={styles['sticker']}>
          <Switch
            id='apply-overrides'
            label="FMO"
            checked={displayFMO}
            onChange={handleSwitchFMO}
          />
        </div>
      }
      <div
        ref={demoText}
        className={clsx(styles.temoin, 'agf-component')}
        data-txt={showUserTextSwitch ? userText : text}
        contentEditable={showUserTextSwitch}
        role={showUserTextSwitch ? 'textbox' : ''}
        aria-multiline={showUserTextSwitch ? true : false}
        tabIndex={showUserTextSwitch ? 0 : -1}
        suppressContentEditableWarning={true}
        onBlur={saveUserText}
        onPaste={pasteUserText}
        onFocus={handleFocus}
        lang={userData.language}
      >
        {(showUserTextSwitch) ? userText : text}
      </div>
    </section>
  );
};
