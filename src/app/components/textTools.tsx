'use client'
import { useEffect, useState } from 'react';
import textToolsStyles from './textTools.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';
import { useUserData,useUserDataDispatch } from './userDataBis';

const defaultAlpha = .8;
const defaultFontSize = 24;

type TextToolsProps = {
    checked: boolean,
    onChange(event: React.ChangeEvent<HTMLInputElement>): void,
}

type UserSettingsType = {
    opacity: string,
    fontSize: string,
}
type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | Array<JSONValue>;


export default function TextTools({ checked, onChange }: TextToolsProps) {

    const userData = useUserData();
    const dispatch = useUserDataDispatch();
    console.log('yo!!', userData)

    const [alphaSlider, setAlphaSlider] = useState(parseFloat(userData.opacity));
    const [fontSizeSlider, setFontSizeSlider] = useState(parseInt(userData.fontSize));

    const handleAlphaSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setAlphaSlider(parseFloat(ev.target.value));
        dispatch({
            type: 'changeOpacity',
            payload:{
                value: ev.target.value,
            }
        })
    }

    const handleFontSizeSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFontSizeSlider(parseInt(ev.target.value));
    }

    const handleReset = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setFontSizeSlider(defaultFontSize);
        setAlphaSlider(defaultAlpha);
        // setEditSwitch(true);
    }

    // Fallback font's Alpha -------------
    useEffect(() => {
        document.body.style.setProperty('--fallback-opacity', alphaSlider.toString());
    }, [alphaSlider]);

    // Fallback font's Family -------------
    useEffect(() => {
        document.body.style.setProperty('--temoin-fs', `${fontSizeSlider}px`);
    }, [fontSizeSlider]);

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
                    checked={checked}
                    onChange={onChange}
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
