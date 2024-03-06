import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import sectionStyles from './sectionCode.module.scss';
import type { FontOverridesType } from '../../../types/types'
import { useEffect, useRef } from 'react';
import { copyToClipboard } from '../_lib/utils';
import { useOverrides } from '../context/overridesContext';
import { useFontInfos } from '../context/fontContext';
import { fontKitLoad } from '../_lib/fonts';
import { Icon } from './Icon';

type CodeProps = {
    code: FontOverridesType[]
}

export default function SectionCode({ code }: CodeProps) {
    const codeRef = useRef<null | HTMLElement>(null);

    const className = `code ${sectionStyles['code-container']}`;

    const fontInfos = useFontInfos();

    let theCSS: string ='';

    const getFontFaces = (overrides: FontOverridesType) => {
        return `
        @font-face {
            font-family: "${overrides.overridesName}";
            src: local("${overrides.fullName}"),
            local("${overrides.postscriptName}");
            size-adjust: ${overrides.sizeAdjust};
            ascent-override: ${overrides.ascent};
            descent-override: ${overrides.descent};
            line-gap-override: ${overrides.lineGap};
        }`;
    }

    if (Array.isArray(code) && code.length) {
        let codeFontFaces = '';
        let bodyVals: string[] = [];
        code.forEach((obj, idx) => {
            codeFontFaces += getFontFaces(obj);
            if (idx === 0) bodyVals.push(`"${fontInfos.fullName}"`)
            bodyVals.push(`"${obj.overridesName}"`);
        });
        theCSS = `
${codeFontFaces}

/* Usage: */
body {
    font-family: ${bodyVals.join(', ')};
}`;
    }

    
    // TODO: signaler que c'est copié (autrement qu'avec un console!)
    const handleClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (codeRef.current) {
            let css = codeRef.current.dataset.css;
            css = decodeURI(css as string);
            copyToClipboard(css);
            console.log("Copied !")
        }
    }

    useEffect(() => {
        const highlight = async () => {
            await Prism.highlightAll();
        }
        highlight();
    }, [theCSS]);


    return (
        <section
            ref={codeRef}
            className={className}
            // data-css={encodeURI(codeFontFaces)}
        >
            <label htmlFor='copyBtn'>
                <button
                    type='button'
                    id='copyBtn'
                    onClick={handleClick}
                >
                    <Icon name={'copy'} />
                </button>
                <span className={sectionStyles['tooltip']}>Copy Code</span>
            </label>
            <pre>
                <code className="language-css" >
                    {theCSS}
                </code>
            </pre>
        </section>
    )
}