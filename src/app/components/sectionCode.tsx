import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import clsx from 'clsx';
import sectionStyles from './sectionCode.module.scss';
import { fallbackFonts, FontOverridesType } from '../../../types/types'
import { useEffect, useMemo } from 'react';
import { copyToClipboard } from '../_lib/utils';
import { useUserData } from '../context/userDataContext';
import { useFontInfos } from '../context/fontContext';
import BtnIcon from './form-components/btnIcon/btnIcon';

type CodeProps = {
    code: FontOverridesType[]
}

export default function SectionCode({ code }: CodeProps) {

    const userData = useUserData();
    const language = (userData.language === 'en') ? 'English' : 'French';

    const fontInfos = useFontInfos();

    const getFontFaces = (overrides: FontOverridesType) => {
        return `
@font-face {
    font-family: "${overrides.overridesName}";
    src:
        local("${overrides.fullName}"),
        local("${overrides.postscriptName}");
    size-adjust: ${overrides.sizeAdjust};
    ascent-override: ${overrides.ascent};
    descent-override: ${overrides.descent};
    line-gap-override: ${overrides.lineGap};
}`;
    }

    const getCode = () => {
        let css: string = '';
        let example: string = '';
        if (Array.isArray(code) && code.length) {
            const fallbackFont = userData.fallbackFont
            // reorder fallback fonts array
            let fontArray = fallbackFonts.filter(f => f !== fallbackFont);
            fontArray = [fallbackFont, ...fontArray];
            let codeFontFaces = '';
            let bodyVals: string[] = [];
            fontArray.forEach((font, idx) => {
                // find the right object in `code`
                const obj = code.find(o => o.name === font);
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
        }
        if (css && example) {
            return {
                css: css,
                body: example
            }
        } else {
            return null;
        }
    }

    const theCode = useMemo(getCode, [userData.fallbackFont, code, fontInfos.fullName]);

    const handleClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // TODO: signaler que c'est copié (autrement qu'avec un console!)
        if (theCode) {
            const where = ev.currentTarget.closest('DIV') as HTMLElement;
            const what = where?.dataset.code;
            switch (what) {
                case 'CSS':
                    copyToClipboard(theCode.css);
                    break;
                case 'Example':
                    copyToClipboard(theCode.body);
                    break;
                default:
                    return;
            }
            console.log("Copied !")
        }
    }

    useEffect(() => {
        const highlight = async () => {
            await Prism.highlightAll();
        }
        highlight();
    }, [theCode]);


    if (theCode) return (
        <section className={sectionStyles['generated-css']}>
            <h3>Font metrics (optimized for {language} text)</h3>
            <div
                className={clsx('code', sectionStyles['code-container'])}
                data-code='CSS'
            >
                <BtnIcon
                    id='copyCSS'
                    iconName='copy'
                    onClick={handleClick}
                    text='Copy Code'
                />
                <pre>
                    <code className="language-css" >
                        {theCode.css}
                    </code>
                </pre>
            </div>

            <h3>Usage example</h3>
            <div
                className={clsx(code, sectionStyles['code-container'])}
                data-code='Example'
            >
                <BtnIcon
                    id='copyExample'
                    iconName='copy'
                    onClick={handleClick}
                    text='Copy Code'
                />
                <pre>
                    <code className="language-css" >
                        {theCode.body}
                    </code>
                </pre>
            </div>
        </section>
    )
}