'use client'
// localStorage only exists in browser !

import React, { useState, useEffect } from "react";
import styles from './demoText.module.scss';
import TextTools from "./textTools";
import { dummyText } from '@/app/_lib/dummyText';
import { LanguagesType, FontOverridesType } from '@/app/_lib/types';
import { useUserDataDispatch, useUserData } from "@/app/context/userData";
import Switch from "./form-components/switch/switch";
import { updateCustomProperty } from "../_lib/utils";


type Props = {
  lang: LanguagesType,
  overrides: FontOverridesType,
};

export default function DemoText(props: Props) {

  const userData = useUserData();
  let userText = userData.userText;
  const dispatch = useUserDataDispatch();

  const [showUserTextSwitch, setShowUserTextSwitch] = useState(userData.showUserText);

  const lang = props.lang;
  const text = dummyText[(lang as keyof typeof dummyText)];

  const overrides = props.overrides;

  const handleShowUserTextSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setShowUserTextSwitch(ev.target?.checked);
    dispatch({
      type: 'showDemoText',
      payload: {
        value: ev.target?.checked,
      }
    });
  }

  const saveUserText = (ev: React.FocusEvent<HTMLDivElement, Element>) => {
    const newText = (ev.currentTarget.textContent) ? ev.currentTarget.textContent : '';
    dispatch({
      type: 'changeDemoText',
      payload: { value: newText }
    });
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
  }, [overrides]);

  useEffect(() => {
    const val = displayFMO ? overrides.overridesName : overrides.postscriptName;
    updateCustomProperty('--fallback-family', val);
  }, [displayFMO, overrides]);

  return (
    <div className={styles['text-container']}>
      <TextTools
        checked={showUserTextSwitch}
        onChange={handleShowUserTextSwitch}
      />

      {overrides.overridesName !== '' &&
        <div className={styles['sticker']}>
          <Switch
            id='apply-overrides'
            label="Apply FMO"
            checked={displayFMO}
            onChange={handleSwitchFMO}
          />
        </div>
      }
      <div
        className={styles.temoin}
        data-txt={showUserTextSwitch ? userText : text}
        contentEditable={showUserTextSwitch}
        role={showUserTextSwitch ? 'textbox' : ''}
        aria-multiline={showUserTextSwitch ? true : false}
        tabIndex={showUserTextSwitch ? 0 : -1}
        suppressContentEditableWarning={true}
        onBlur={saveUserText}
        onPaste={pasteUserText}
      >
        {!showUserTextSwitch && text}
        {(showUserTextSwitch && userText) && userText}
      </div>
    </div>
  );
};
