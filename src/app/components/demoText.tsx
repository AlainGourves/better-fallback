'use client'
// localStorage only exists in browser !

import React, { useState, useEffect, useRef } from "react";
import styles from './demoText.module.scss';
import TextTools from "./textTools";
import { dummyText } from '@/app/_lib/dummyText';
import { useUserDataDispatch, useUserData } from "@/app/context/userDataContext";
import Switch from "./form-components/switch/switch";
import { updateCustomProperty } from "../_lib/utils";
import { useOverrides, useOverridesDispatch } from "../context/overridesContext";

export default function DemoText() {

  const demoText = useRef<HTMLDivElement | null>(null);

  const userData = useUserData();
  let userText = (userData.userText) ? userData.userText : '';
  const dispatchUserData = useUserDataDispatch();

  const overrides = useOverrides();

  const [showUserTextSwitch, setShowUserTextSwitch] = useState(userData.showUserText);

  const lang = userData.language ? userData.language : 'en';
  const text = dummyText[(lang as keyof typeof dummyText)];

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

  const saveUserText = (ev: React.FocusEvent<HTMLDivElement, Element>) => {
    setIsEditing(false);
    // Important ! contentEditable attribute is an enumerated one and not a Boolean one
    // its value is a string, not a bool
    if (demoText.current?.contentEditable==='true') {
      const newText = (ev.currentTarget.innerText) ? ev.currentTarget.innerText : '';
      dispatchUserData({
        type: 'changeDemoText',
        payload: { value: newText }
      });
    }
  }


  // TODO:
  const pasteUserText = (ev: React.ClipboardEvent<HTMLDivElement>) => {
    // Captures the `paste` event to only get plain text instead of HTML rich content
    ev.preventDefault();
    // get text representation of clipboard
    const text = (ev.clipboardData).getData("text/plain");
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
  }

  // Handle wether the text is displayed with or without Fonts Metrics Overrides
  const [displayFMO, setDisplayFMO] = useState(false);
  const handleSwitchFMO = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayFMO(ev.target.checked);
  }

  useEffect(() => {
    setDisplayFMO(overrides.isActive);
  }, [overrides.isActive]);

  useEffect(() => {
    const val = displayFMO ? overrides.overridesName : overrides.postscriptName;
    updateCustomProperty('--fallback-family', val);
  }, [displayFMO, overrides]);

  const handleInput = (ev: React.FormEvent<HTMLDivElement>) => {
    setIsEditing(true);
  }

  return (
    <div className={styles['text-container']}>
      <TextTools
        checked={showUserTextSwitch}
        onChange={handleShowUserTextSwitch}
      />

      {(overrides.overridesName !== '' && !isEditing) &&
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
        className={styles.temoin}
        data-txt={showUserTextSwitch ? userText : text}
        contentEditable={showUserTextSwitch}
        role={showUserTextSwitch ? 'textbox' : ''}
        aria-multiline={showUserTextSwitch ? true : false}
        tabIndex={showUserTextSwitch ? 0 : -1}
        suppressContentEditableWarning={true}
        onBlur={saveUserText}
        onPaste={pasteUserText}
        onInput={handleInput}
      >
        {(showUserTextSwitch) ? userText : text}
      </div>
    </div>
  );
};
