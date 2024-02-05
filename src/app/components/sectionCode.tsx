import Prism from 'prismjs';
import "prismjs/themes/prism-tomorrow.css";
import type { FontOverrides } from '../page'
import { useEffect } from 'react';

type SectionCodeType = {
    fallbackName: string,
    overrides: FontOverrides
}

export default function SectionCode(props: SectionCodeType) {

    const name = props.fallbackName
    const overrrides = props.overrides;

    let code = `@font-face{
        font-family: ${name};
        src: local("${overrrides.fullName}"),
             local("${overrrides.postscriptName}");
        size-adjust: ${overrrides.sizeAdjust};
        ascent-override: ${overrrides.ascent};
        descent-override: ${overrrides.descent};
        line-gap-override: ${overrrides.lineGap};
    }`;

    useEffect(() => {
        const highlight = async () => {
            await Prism.highlightAll();
        }
        highlight();
    }, [code]);


    return (
        <section className="code">
            <pre>
                <code className="language-css" >
                    {code}
                </code>
            </pre>
        </section>
    )
}