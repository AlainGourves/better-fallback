'use client'
// localStorage only exists in browser !

import React, { useState, useEffect, forwardRef } from "react";
import TextTools from "./textTools";
import { dummyText } from '../_lib/dummyText';
import { supportsLocalStorage, saveToLocalStorage, getLocalStorage } from '@/app/_lib/localstorage';
import styles from './demoText.module.scss';
import { LanguagesType } from '../page';


// To get rid of Typescript errors
// cf: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/

type Props = { lang: LanguagesType };

const DemoText = forwardRef<HTMLDivElement, Props>(function DemoText(props: Props, ref) {

  const [editSwitch, setEditSwitch] = useState(false);

  const lang = props.lang;
  const text = dummyText[(lang as keyof typeof dummyText)];
  let userText = undefined;

  if (supportsLocalStorage()) {
    userText = getLocalStorage('userText');
  }

  const handleEditSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setEditSwitch(ev.target?.checked);
  }

  const saveUserText = (ev: React.FocusEvent<HTMLDivElement, Element>) => {
    const newText = ev.currentTarget.textContent;
    if (newText) {
      saveToLocalStorage('userText', newText);
    }
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
    console.log(editSwitch ? "j'édite" : "j'édite pas")
  }, [editSwitch])


  return (
    <div className={styles['text-container']}>
      <TextTools
        checked={editSwitch}
        onChange={handleEditSwitch}
      />
      <div
        ref={ref}
        className={styles.temoin}
        data-txt={!editSwitch ? text : ''}
        contentEditable={editSwitch}
        suppressContentEditableWarning={true}
        onBlur={saveUserText}
        onPaste={pasteUserText}
      >
        {!editSwitch && text}
        {(editSwitch && userText) && userText}
      </div>
    </div>
  );
});

export default DemoText;