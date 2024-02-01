import { useEffect, useState } from 'react';
import textToolsStyles from './textTools.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';

const defaultAlpha = .5;
const defaultFontSize = 24;

export default function TextTools(props: any) {
    const [alphaSlider, setAlphaSlider] = useState(defaultAlpha);
    const [fontSizeSlider, setFontSizeSlider] = useState(defaultFontSize);
    const [FMOSwitch, setFMOSwitch] = useState(true);

    const handleAlphaSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setAlphaSlider(parseFloat(ev.target.value));
    }

    const handleFontSizeSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFontSizeSlider(parseInt(ev.target.value));
    }

    const handleFMOSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFMOSwitch(ev.target?.checked);
    }

    useEffect(() => {
        document.body.style.setProperty('--fallback-opacity', alphaSlider.toString())
    }, [alphaSlider])

    useEffect(() => {
        document.body.style.setProperty('--temoin-fs', `${fontSizeSlider}px`)
    }, [fontSizeSlider])


    const handleReset = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontSizeSlider(defaultFontSize);
        setAlphaSlider(defaultAlpha);
        setFMOSwitch(true);
    }

    return (
        <div className={textToolsStyles['text-tools-container']}>
            <div className={textToolsStyles['text-tools']}>
                <Slider
                    id='slider-alpha'
                    min={0}
                    max={1}
                    step={0.1}
                    value={alphaSlider}
                    label='Transparency'
                    onChange={handleAlphaSlider}
                    isOutput={true}
                />
                <span className={textToolsStyles.divider}></span>
                <Slider
                    id='slider-font-size'
                    min={10}
                    max={128}
                    step={1}
                    value={fontSizeSlider}
                    label='Font Size'
                    onChange={handleFontSizeSlider}
                    isOutput={true}
                />
                <span className={textToolsStyles.divider}></span>
                <Switch
                    id='switch-fmo'
                    label={'FMO'}
                    title='Font Metrics Overrides'
                    checked={FMOSwitch}
                    onChange={handleFMOSwitch}
                    />
                <span className={textToolsStyles.divider}></span>
                <button
                    className={textToolsStyles['reset-btn']}
                    onClick={handleReset}
                    title='Reset'
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
                        <path fill="currentColor" d="M17.96 5v1.65a8 8 0 1 0 1.29 8.8 1 1 0 0 0-.9-1.44c-.37 0-.73.2-.88.53A6 6 0 1 1 17.22 9h-3.25c-.55 0-1 .45-1 1s.45 1 1 1h5a1 1 0 0 0 1-1V5c0-.55-.45-1-1-1s-1 .45-1 1z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
