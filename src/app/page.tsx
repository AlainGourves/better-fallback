'use client';
import React, { useState, useRef, useEffect } from 'react';
import * as fontkit from 'fontkit';
import { fetchFont, loadFont, checkFontFile, fontKitLoad } from './_lib/fonts';
import { demoText } from './_lib/demoText';
import { URLValidator } from './_lib/utils';
import styles from './page.module.scss'
import Image from 'next/image';
import TextInput from './components/form-components/textInput/textInput';
import Button from './components/form-components/button/button';
import Select from './components/form-components/select/select';
import RadioGroup from './components/form-components/radioGroup/radioGroup';
import TextTools from './components/textTools';
import FontFile from './components/fontFile';

export default function Home() {
  const fontTypes = ['font/otf', 'font/ttf', 'font/woff2', 'font/woff'];
  const [fontInfos, setFontInfos] = useState({
    fileName: '',
    fullName: '',
    fontType: '',
    size: ''
  });

  const [fontURL, setFontURL] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const temoinRef = useRef<HTMLDivElement>(null);
  const fontInfosDiv = useRef<HTMLDivElement>(null);

  // Error handling
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!error) setErrorMessage('');
  }, [error]);


  // `Select` for choosing fallback font
  const fallbackFontsOptions = [
    { value: 'times', text: 'Times New Roman', style: "'Times New Roman', times, serif" },
    { value: 'arial', text: 'Arial', style: "Arial, sans-serif" },
    { value: 'roboto', text: 'Roboto', style: "'Roboto Regular', roboto, sans-serif" }
  ];
  const fallbackFontDefault = 'Times New Roman';
  const [fallbackFontValue, setFallbackFontValue] = useState(fallbackFontDefault);
  const handleFallbackSelect = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    if (ev.target.value) setFallbackFontValue(ev.target.value);
  }

  useEffect(() => {
    document.body.style.setProperty('--fallback-family', fallbackFontValue);
  }, [fallbackFontValue])

  // `RadioGroup` for choosing the target language
  const languageOptions = [
    { id: 'lang-en', label: 'English', value: 'en' },
    { id: 'lang-fr', label: 'French', value: 'fr' }
  ]
  const languageOptionsDefault = 'en';
  const [targetedLanguage, setTargetedLanguage] = useState(languageOptionsDefault);
  const handleLanguageChoice = (ev: React.FormEvent<HTMLFieldSetElement>) => {
    const field = ev.currentTarget;
    const selected = field.querySelector('[type=radio]:checked') as HTMLInputElement;
    if (selected) {
      setTargetedLanguage(selected.value);
    }
  }

  // Input[File] for selecting a font
  const handleFontFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return;
    setFontURL(''); // get rid of an eventual URL
    setFontFile(ev.target.files[0]);
    console.log('handleFontFile', ev.currentTarget.form)
  }

  // 'X' button to remove previously selected font file
  const handleRemoveFontFile = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setFontFile(null);
    if (error === true) setError(false);
  }

  // Input[text] for font URL
  const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log('from handleFontURL');
    const val = ev.target.value;
    if (URLValidator(val) || val === '') {
      urlRef.current?.setCustomValidity(''); // remove :invalid state if present
    }
    setFontURL(ev.target.value);
  };
  // button with an 'X' to erase TextInpu
  const eraseTextInput = (ev: React.MouseEvent<HTMLButtonElement>) => {
    setFontURL('');
    if (error === true) setError(false);
  }

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (fontURL === '' && fontFile === null) return;
    if (fontURL && !URLValidator(fontURL)) {
      // Error handling
      const msg = "Please, verify the URL format.";
      urlRef.current?.setCustomValidity(msg); // Sets the :invalid state to the input
      urlRef.current?.reportValidity(); // display the tooltip
      return;
    }
    try {
      console.log('from handleSubmit')
      // TODO: which choice if fontUrl & fontFile are defined ?
      // -> variable to store the last modified ?
      // 1) fontUrl -> Load the font
      if (fontURL) {
        const file = await fetchFont(fontURL);
        // setFontURL('');
        // setFontFile(file);
        await handleFile(file);
      }
      // 2) fontFile -> check the file type
      if (fontFile) {
        await handleFile(fontFile);
      }
      // 3) Dropped File
    } catch (err) {
      // TODO: Error handling
      setError(true);
      if (err instanceof Error) {
        setErrorMessage(`${err.name}: ${err.message}`)
      }
    }
  }

  const handleFile = async (file: File) => {
    try {
      let size = Math.round(file.size / 100) / 10;
      const fType = await checkFontFile(file);
      const font = await fontKitLoad(file);

      setFontInfos((fontInfos) => ({
        ...fontInfos,
        fileName: file.name,
        fullName: font.fullName,
        fontType: fType,
        size: `${(Number.isInteger(size)) ? size : size.toFixed(1)}Ko`
      }));

      await loadFont(font.fullName, file);
    } catch (error) {
      // rethrows the error
      throw new Error(`handleFile: ${error}`);
    }
  }

  useEffect(() => {
    if (fontInfos.fullName) {
      if (fontInfosDiv.current) {
        let el = fontInfosDiv.current.querySelector('dl:nth-of-type(1) dd');
        if (el) el.textContent = fontInfos.fullName;
        el = fontInfosDiv.current.querySelector('dl:nth-of-type(2) dd')
        if (el) el.textContent = fontInfos.fontType;
        el = fontInfosDiv.current.querySelector('dl:nth-of-type(3) dd');
        if (el) el.textContent = fontInfos.size;
      }
      console.log(`font check (${fontInfos.fullName})`, document.fonts.check(`16px '${fontInfos.fullName}'`))
      if (temoinRef.current) {
        temoinRef.current.style.fontFamily = `'${fontInfos.fullName}'`;
        console.log('témoin-> done something')
      }
    };
    console.log('fontInfos->', fontInfos)
  }, [fontInfos]);


  return (
    <main className={styles.main}>
      <form
        id="select-font"
        className={styles["select-font"]}
        onSubmit={handleSubmit}>
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
                accept={fontTypes.join(',')}
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
          <Button
            id="select-font-submit"
            type="submit"
            text={'Load the font'}
            classAdd={'outlined'}
            disabled={!fontURL && !fontFile}
          />
        </div>
        {error && (
          <div className={styles['error-msg-container']}>
            <div className={styles['error-msg']}>
              <h3>A problem occurred!</h3>
              {errorMessage && errorMessage}
            </div>
          </div>
        )}
      </form>
      <div className={styles['font-settings']}>
        <div className={styles['font-infos']} ref={fontInfosDiv}>
          <h3>Selected Font</h3>
          <div>
            <dl>
              <dt>Name</dt>
              <dd></dd>
            </dl>
            <dl>
              <dt>Type</dt>
              <dd></dd>
            </dl>
            <dl>
              <dt>Size</dt>
              <dd></dd>
            </dl>
          </div>
        </div>

        <div className={styles['fallback-font']}>
          <h3>Fallback Font</h3>
          <Select
            id='fallbackFontSelect'
            label='Font'
            options={fallbackFontsOptions}
            defaultValue={fallbackFontDefault}
            onChange={handleFallbackSelect}
          />

          <RadioGroup
            groupName='targetLanguage'
            defaultValue={languageOptionsDefault}
            radios={languageOptions}
            onInput={handleLanguageChoice}
            label='Lang.'
          />
        </div>

        <div>
          <Button
            id="proceed"
            type="button"
            text='Proceed'
            onClick={(ev) => console.log('yolo!')}
          />
        </div>
      </div>

      <div className={styles['text-container']}>
        <TextTools />
        <div
          className={styles.temoin}
          ref={temoinRef}
          data-txt={demoText[targetedLanguage as keyof typeof demoText]}>
          {demoText[targetedLanguage as keyof typeof demoText]}
        </div>
      </div>
    </main>
  )
}