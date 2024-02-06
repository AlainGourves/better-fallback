import React, { useState, useEffect, forwardRef } from "react";
import TextTools from "./textTools";
import { dummyText } from '../_lib/dummyText';
import styles from './demoText.module.scss';
import { LanguagesType } from '../page';


// To get rid of Typescript errors
// cf: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/

type Props = {lang: LanguagesType};

const DemoText = forwardRef<HTMLDivElement, Props>(function DemoText(props: Props, ref) {

  const [editSwitch, setEditSwitch] = useState(false);

  const lang = props.lang;
  const text = dummyText[(lang as keyof typeof dummyText)];

  const handleEditSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setEditSwitch(ev.target?.checked);
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
        data-txt={text}
      >
        {text}
      </div>
    </div>
  );
});

export default DemoText;