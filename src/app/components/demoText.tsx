'use client'
// localStorage only exists in browser !

import React, { useState, useEffect } from "react";
import TextTools from "./textTools";
import { dummyText } from '../_lib/dummyText';
import { supportsLocalStorage, saveToLocalStorage, getLocalStorage } from '@/app/_lib/localstorage';
import styles from './demoText.module.scss';
import { LanguagesType } from '@/app/_lib/types';
import { useUserDataDispatch, useUserData } from "../context/userData";


type Props = { lang: LanguagesType };

export default function DemoText(props: Props) {

  const userData = useUserData();
  let userText = userData.userText;
  const dispatch = useUserDataDispatch();

  const [showUserTextSwitch, setShowUserTextSwitch] = useState(userData.showUserText);

  const lang = props.lang;
  const text = dummyText[(lang as keyof typeof dummyText)];

  // if (supportsLocalStorage()) {
  //   userText = getLocalStorage('userText') as string;
  // }

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

  // Edit Switch -------------
  useEffect(() => {
    // Make the demo text DIV editable
    // console.log(showUserTextSwitch ? "j'édite" : "j'édite pas")
  }, [showUserTextSwitch])


  return (
    <div className={styles['text-container']}>
      <TextTools
        checked={showUserTextSwitch}
        onChange={handleShowUserTextSwitch}
      />
      <div
        className={styles.temoin}
        data-txt={showUserTextSwitch ? userText : text}
        contentEditable={showUserTextSwitch}
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
