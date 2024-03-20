import { useState } from 'react';
import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import clsx from 'clsx';
import sectionStyles from './sectionCode.module.scss';
import { fallbackFonts, FontOverridesType } from '../../../types/types'
import { useEffect, useMemo } from 'react';
import { copyToClipboard } from '../_lib/utils';
import { useUserData } from '../context/userDataContext';
import { useFontInfos } from '../context/fontContext';
import { useOverrides } from '../context/overridesContext';
import BtnIcon from './form-components/btnIcon/btnIcon';

type CSSCodeType = {
    css: string,
    body: string
}

export default function SectionCode() {

    const userData = useUserData();
    const language = (userData.language === 'en') ? 'English' : 'French';

    const fontInfos = useFontInfos();

    const overrides = useOverrides();

    let theCode: CSSCodeType | null = null; // stores the code to copy
    let theHTML: CSSCodeType | null = null; // stores syntax highlighted code

    const getFontFaces = (font: FontOverridesType) => {
        return `
@font-face {
    font-family: "${font.overridesName}";
    src:
        local("${font.fullName}"),
        local("${font.postscriptName}");
    size-adjust: ${font.sizeAdjust};
    ascent-override: ${font.ascent};
    descent-override: ${font.descent};
    line-gap-override: ${font.lineGap};
}`;
    }

    const getCode = () => {
        if (!overrides.length) return null;
        let css: string = '';
        let example: string = '';
        const fallbackFont = userData.fallbackFont
        // reorder fallback fonts array
        let fontArray = fallbackFonts.filter(f => f !== fallbackFont);
        fontArray = [fallbackFont, ...fontArray];
        let codeFontFaces = '';
        let bodyVals: string[] = [];
        fontArray.forEach((font, idx) => {
            // find the right object in `code`
            const obj = overrides.find(o => o.name === font);
            if (obj) {
                codeFontFaces += getFontFaces(obj);
                if (idx === 0) bodyVals.push(`"${fontInfos.fullName}"`)
                bodyVals.push(`"${obj.overridesName}"`);
            }
        });
        css = `
${codeFontFaces}`;

        example = `
body {
    font-family:
        ${bodyVals.reduce((acc, cur) => `${acc},\n\t\t${cur}`)};
}`;
        if (css && example) {
            return {
                css: css,
                body: example
            }
        } else {
            return null;
        }
    }

    const colorCode = (code: CSSCodeType) => {
        if (!code) return null;
        const css = Prism.highlight(code.css, Prism.languages.css, 'css');
        const body = Prism.highlight(code.body, Prism.languages.css, 'css');
        return {
            css: css,
            body: body
        }
    }

    const [animBtn1, setAnimBtn1] = useState(false);
    const [animBtn2, setAnimBtn2] = useState(false);
    const handleClick = async (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // TODO: signaler que c'est copié (autrement qu'avec un console!)
        if (theCode) {
            const where = ev.currentTarget.closest('DIV.code') as HTMLElement;
            const what = where?.dataset.code;
            switch (what) {
                case 'CSS':
                    await copyToClipboard(theCode.css);
                    setAnimBtn1(true);
                    break;
                case 'Example':
                    await copyToClipboard(theCode.body);
                    setAnimBtn2(true);
                    break;
                default:
                    return;
            }
            setTimeout(()=>{
                setAnimBtn1(false);
                setAnimBtn2(false);
            }, 500);
            console.log("Copied !")
        }
    }

    theCode = useMemo(getCode, [userData.fallbackFont, overrides, fontInfos.fullName]);
    if (overrides.length && theCode) {
        theHTML = colorCode(theCode as CSSCodeType);
    }

    if (theHTML) return (
        <section className={sectionStyles['generated-css']}>
            <h3>Font metrics (optimized for {language} text)</h3>
            <div
                className={clsx('code', sectionStyles['code-container'])}
                data-code='CSS'
            >
                <BtnIcon
                    id='copyCSS'
                    iconName={animBtn1 ? 'check' : 'copy'}
                    onClick={handleClick}
                    text='Copy Code'
                    className={clsx(animBtn1 && 'anim-icon')}
                    />
                <Code str={theHTML.css} />
            </div>

            <h3>Usage example</h3>
            <div
                className={clsx('code', sectionStyles['code-container'])}
                data-code='Example'
                >
                <BtnIcon
                    id='copyExample'
                    iconName={animBtn2 ? 'check' : 'copy'}
                    onClick={handleClick}
                    text='Copy Code'
                    className={clsx(animBtn2 && 'anim-icon')}
                />
                <Code str={theHTML.body} />
            </div>
        </section>
    )
}


// Component for the PrismJS code ----------
type CodePropType = {
    str: string
}

function Code(props: CodePropType) {
    return (
        <pre>
            <code
                className="language-css"
                dangerouslySetInnerHTML={{ __html: props.str }}
            />
        </pre>
    )
}