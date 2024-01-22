import { useState } from 'react';
import styles from '../page.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';

const defaultAlpha = .5;
const defaultFontSize = 16;

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

    const handleReset = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontSizeSlider(defaultFontSize);
        setAlphaSlider(defaultAlpha);
        setFMOSwitch(true);
    }

    return (
        <div className={styles['text-tools-container']}>
            <div className={styles['text-tools']}>
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
                <Switch
                    id='switch-fmo'
                    label={'Apply FMO'}
                    checked={FMOSwitch}
                    onChange={handleFMOSwitch}
                />
                <button
                    id="controls-reset"
                    className="btn"
                    onClick={handleReset}
                >
                    <span>Reset</span>
                    <svg>
                        <use href="#rotate"></use>
                    </svg>
                </button>
            </div>
        </div>
    );
}
