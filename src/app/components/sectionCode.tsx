import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import sectionStyles from './sectionCode.module.scss';
import type { FontOverridesType} from '@/app/_lib/types'
import { useEffect, useRef } from 'react';
import Button from './form-components/button/button';
import {copyToClipboard} from '../_lib/utils';

type SectionCodeType = {
    fallbackName: string,
    overrides: FontOverridesType
}

export default function SectionCode(props: SectionCodeType) {
    const codeRef = useRef<null|HTMLElement>(null);

    const name = props.fallbackName
    const overrrides = props.overrides;

    const className = `code ${sectionStyles['code-container']}`;

    let code = `
    @font-face {
        font-family: "${name}";
        src: local("${overrrides.fullName}"),
             local("${overrrides.postscriptName}");
        size-adjust: ${overrrides.sizeAdjust};
        ascent-override: ${overrrides.ascent};
        descent-override: ${overrrides.descent};
        line-gap-override: ${overrrides.lineGap};
    }`;

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