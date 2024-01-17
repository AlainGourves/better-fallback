'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.scss'
import TextInput from './components/form-components/textInput/textInput';
import Button from './components/form-components/button/button';
import { fetchExternalFont, loadFont, checkFontFile, fontTest } from './_lib/fonts';

export default function Home() {
  const [fontURL, setFontURL] = useState('');
  const [fontFile, setFontFile] = useState<File | null>(null);
  const temoinRef = useRef<HTMLDivElement>(null);
  const fontInfosDiv = useRef<HTMLDivElement>(null);

  const handleFontFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return;
    setFontURL(''); // get rid of an eventual URL
    setFontFile(ev.target.files[0]);
  }

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
  }

  const loadExternalFont = async () => {
    const blob = await fetchExternalFont(fontURL);
    const externalFile = new File([blob], "Web Font", { type: blob.type });
    await handleFile(externalFile)
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
      const size = file.size / 1000;
      fontInfos.size = `${(Number.isInteger(size)) ? size : size.toFixed(1)}Ko`;
      fontInfos.type = await checkFontFile(file);
      const buffer = await file.arrayBuffer();
      fontInfos.fullName = await fontTest(buffer);
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
            text={'Load the font'} />
        </div>
      </form>
      <div className={styles['font-infos']} ref={fontInfosDiv}>
        <h3>Selected Font</h3>
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
      <div className={styles.temoin} ref={temoinRef}>
        Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire : « Je m’endors. » Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait ; je voulais poser le volume que je croyais avoir encore dans les mains et souffler ma lumière ; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier ; il me semblait que j’étais moi-même ce dont parlait l’ouvrage : une église, un quatuor, la rivalité de François Ier et de Charles-Quint.
      </div>
    </main>
  )
}
