'use client'
import { useEffect, useState } from 'react';
import textToolsStyles from './textTools.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';
import { useUserData, useUserDataDispatch } from '@/app/context/userData';
import { defaultUserData } from '@/app/context/userData';
import ColorInput from './form-components/colorInput/colorInput';

const defaultAlpha = parseFloat(defaultUserData.opacity);
const defaultFontSize = parseInt(defaultUserData.fontSize);
const defaultColor = defaultUserData.color;

type TextToolsProps = {
    checked: boolean,
    onChange(event: React.ChangeEvent<HTMLInputElement>): void,
}

export default function TextTools({ checked, onChange }: TextToolsProps) {

    const userData = useUserData();
    const dispatch = useUserDataDispatch();

    const [alphaSlider, setAlphaSlider] = useState(parseFloat(userData.opacity));
    const [fontSizeSlider, setFontSizeSlider] = useState(parseInt(userData.fontSize));
    const [fallbackColor, setFallbackColor] = useState(userData.color);

    const handleAlphaSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setAlphaSlider(parseFloat(ev.target.value));
        dispatch({
            type: 'changeOpacity',
            payload: {
                value: ev.target.value,
            }
        });
    }

    const handleFontSizeSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFontSizeSlider(parseInt(ev.target.value));
        dispatch({
            type: 'changeFontSize',
            payload: {
                value: ev.target.value,
            }
        });
    }

    const handleFallbackColor = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFallbackColor(ev.target.value);
        dispatch({
            type: 'changeColor',
            payload: {
                value: ev.target.value,
            }
        });
    }

    const handleReset = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontSizeSlider(defaultFontSize);
        setAlphaSlider(defaultAlpha);
        setFallbackColor(defaultColor);
        dispatch({
            type: 'reset',
            payload: null
        });
    }

    // Fallback font's Alpha -------------
    useEffect(() => {
        document.body.style.setProperty('--fallback-opacity', alphaSlider.toString());
    }, [alphaSlider]);

    // Fallback font's Family -------------
    useEffect(() => {
        document.body.style.setProperty('--temoin-fs', `${fontSizeSlider}px`);
    }, [fontSizeSlider]);

    // Fallback font's Color -------------
    useEffect(() => {
        document.body.style.setProperty('--fallback-color', `${fallbackColor}`);
    }, [fallbackColor]);


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
                <ColorInput
                    id='fallback-color'
                    value={fallbackColor}
                    onChange={handleFallbackColor}
                />
                <span className={textToolsStyles.divider}></span>
                <Switch
                    id='switch-edit'
                    label={'Edit text'}
                    title='Provide your own text'
                    checked={checked}
                    onChange={onChange}
                />
                <span className={textToolsStyles.divider}></span>
                <button
                    className={`agf-component ${textToolsStyles['reset-btn']}`}
                    onClick={handleReset}
                    title='Reset'
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 102 102" preserveAspectRatio="xMidYMid meet">
                        <path stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M7.502 67.603a46 46 0 1 0 0-35.206m0-26v26h26" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
