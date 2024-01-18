'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.scss'
import TextInput from './components/form-components/textInput/textInput';
import Button from './components/form-components/button/button';
import { fetchFont, loadFont, checkFontFile, getFontFullName, fontTest } from './_lib/fonts';
import Select from './components/form-components/select/select';
import RadioGroup from './components/form-components/radioGroup/radioGroup';
import Font, * as fontkit from 'fontkit';

export default function Home() {
  // const [font, setFont] = useState<Font | null>(null);
  const [fontURL, setFontURL] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const temoinRef = useRef<HTMLDivElement>(null);
  const fontInfosDiv = useRef<HTMLDivElement>(null);

  // `Select` for choosing fallback font
  const fallbackFontsOptions = [
    { value: 'times', text: 'Times New Roman' },
    { value: 'arial', text: 'Arial' },
    { value: 'roboto', text: 'Roboto' }
  ];
  const fallbackFontDefault = 'times';
  const [fallbackFontValue, setFallbackFontValue] = useState(fallbackFontDefault);
  const handleFallbackSelect = (ev: any) => {
    if (ev.target.value) setFallbackFontValue(ev.target.value);
  }
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
  }

  // Input[text] for font URL
  // TODO: reset fontFile if exists
  const handleFontURL = (ev: React.ChangeEvent<HTMLInputElement>) => setFontURL(ev.target.value);


  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (fontURL === '' && fontFile === null) return;
    // const form = ev.currentTarget;
    // TODO/ set priorities if fontUrl & fontFile are defined
    // 1) fontUrl -> Load the font
    if (fontURL) {
      loadExternalFont();
    }
    // 2) fontFile -> check the file type
    if (fontFile) {
      handleFile(fontFile);
    }
    // 3) Dropped File
  }

  const loadExternalFont = async () => {
    const file = await fetchFont(fontURL);
    await handleFile(file)
  }

  const handleFile = async (file: File) => {
    try {
      const fontInfos = {
        name: '',
        fullName: '',
        type: '',
        size: '',
      }
      fontInfos.name = file.name;
      const size = Math.round(file.size / 100) / 10;
      fontInfos.size = `${(Number.isInteger(size)) ? size : size.toFixed(1)}Ko`;
      fontInfos.type = await checkFontFile(file);
      const buffer = await file.arrayBuffer();
      fontInfos.fullName = getFontFullName(buffer);
      loadFont(fontInfos.fullName, buffer);
      displayFontInfos(fontInfos);
      if (temoinRef.current) {
        temoinRef.current.style.fontFamily = `${fontInfos.fullName}`;
      }
      console.log('>>>', fontInfos)
    } catch (error) {
      console.error('handleFile', error);
    }
  }

  const displayFontInfos = (fontInfos: any) => {
    if (fontInfosDiv.current) {
      let el = fontInfosDiv.current.querySelector('dl:nth-of-type(1) dd');
      if (el) el.textContent = fontInfos.fullName;
      el = fontInfosDiv.current.querySelector('dl:nth-of-type(2) dd')
      if (el) el.textContent = fontInfos.type;
      el = fontInfosDiv.current.querySelector('dl:nth-of-type(3) dd');
      if (el) el.textContent = fontInfos.size;
    }
  }

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
                accept="font/otf, font/ttf, font/woff2, font/woff"
                onChange={handleFontFile}
              />
            </label>
          </div>
        </div>
        <div>OR</div>
        <div>
          <TextInput
            id={'fontUrl'}
            value={fontURL}
            placeholder={'Paste a font URL'}
            onChange={handleFontURL}
          />
          <Button
            id="select-font-submit"
            type="submit"
            text={'Load the font'}
            classAdd={'outlined'}
          />
        </div>
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
      <div className={styles.temoin} ref={temoinRef}>
        Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire : « Je m’endors. » Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait ; je voulais poser le volume que je croyais avoir encore dans les mains et souffler ma lumière ; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier ; il me semblait que j’étais moi-même ce dont parlait l’ouvrage : une église, un quatuor, la rivalité de François Ier et de Charles-Quint.
      </div>
    </main>
  )
}
