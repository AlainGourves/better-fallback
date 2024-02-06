import { useEffect, useState } from 'react';
import textToolsStyles from './textTools.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';

const defaultAlpha = .75;
const defaultFontSize = 24;

export default function TextTools(props: any) {
    const [alphaSlider, setAlphaSlider] = useState(defaultAlpha);
    const [fontSizeSlider, setFontSizeSlider] = useState(defaultFontSize);
    const [editSwitch, setEditSwitch] = useState(true);

    const handleAlphaSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setAlphaSlider(parseFloat(ev.target.value));
    }

    const handleFontSizeSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFontSizeSlider(parseInt(ev.target.value));
    }

    const handleEditSwitch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setEditSwitch(ev.target?.checked);
    }

    const handleReset = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontSizeSlider(defaultFontSize);
        setAlphaSlider(defaultAlpha);
        setEditSwitch(true);
    }

    // Fallback font's Alpha -------------
    useEffect(() => {
        document.body.style.setProperty('--fallback-opacity', alphaSlider.toString())
    }, [alphaSlider])

    // Fallback font's Family -------------
    useEffect(() => {
        document.body.style.setProperty('--temoin-fs', `${fontSizeSlider}px`)
    }, [fontSizeSlider])

    // Edit Switch -------------
    // useEffect(() => {
    //     // Make the demo text DIV editable
    // }, [editSwitch])

    return (
        <div className={textToolsStyles['text-tools-container']}>
            <div className={textToolsStyles['text-tools']}>
                <Slider
                    id='slider-alpha'
                    min={0}
                    max={1}
                    step={0.1}
                    value={alphaSlider}
                    label='Opacity'
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
                    label='Font size'
                    onChange={handleFontSizeSlider}
                    isOutput={true}
                />
                <span className={textToolsStyles.divider}></span>
                <Switch
                    id='switch-edit'
                    label={'Edit text'}
                    title='Font Metrics Overrides'
                    checked={editSwitch}
                    onChange={handleEditSwitch}
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
