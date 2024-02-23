import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import sectionStyles from './sectionCode.module.scss';
import type { FontOverridesType} from '@/app/_lib/types'
import { useEffect, useRef } from 'react';
import Button from './form-components/button/button';
import {copyToClipboard} from '../_lib/utils';
import { useOverrides } from '../context/overridesContext';

type CodeProps={
    overrides: FontOverridesType
}

export default function SectionCode() {
    const codeRef = useRef<null|HTMLElement>(null);

    const className = `code ${sectionStyles['code-container']}`;

    const overrides = useOverrides();

    const code = `
    @font-face {
        font-family: "${overrides.overridesName}";
        src: local("${overrides.fullName}"),
             local("${overrides.postscriptName}");
        size-adjust: ${overrides.sizeAdjust};
        ascent-override: ${overrides.ascent};
        descent-override: ${overrides.descent};
        line-gap-override: ${overrides.lineGap};
    }`;

    // TODO: signaler que c'est copié (autrement qu'avec un console!)
    const handleClick = (ev:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        if (codeRef.current){
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
    }, [code]);


    return (
        <section
            ref={codeRef}
            className={className}
            data-css={encodeURI(code)}
        >
            <Button
                type='button'
                text='Copy Code'
                onClick={handleClick}
                classAdd={['small', 'outlined']}
            />
            <pre>
                <code className="language-css" >
                    {code}
                </code>
            </pre>
        </section>
    )
}