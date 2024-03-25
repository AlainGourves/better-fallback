'use client'
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import textToolsStyles from './textTools.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';
import { useUserData, useUserDataDispatch } from '@/app/context/userDataContext';
import { defaultUserData } from '@/app/context/userDataContext';
import ColorInput from './form-components/colorInput/colorInput';
import { updateCustomProperty } from '../_lib/utils';
import BtnIcon from './form-components/btnIcon/btnIcon';

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
        updateCustomProperty('--fallback-opacity', alphaSlider.toString());
    }

    const handleFontSizeSlider = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFontSizeSlider(parseInt(ev.target.value));
        dispatch({
            type: 'changeFontSize',
            payload: {
                value: ev.target.value,
            }
        });
        updateCustomProperty('--temoin-fs', `${fontSizeSlider}px`);
    }

    const handleFallbackColor = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setFallbackColor(ev.target.value);
        dispatch({
            type: 'changeColor',
            payload: {
                value: ev.target.value,
            }
        });
        updateCustomProperty('--fallback-color', `${fallbackColor}`);
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
                <BtnIcon
                    className={clsx('agf-component', textToolsStyles['reset-btn'])}
                    id='reset-settings'
                    iconName='reset'
                    onClick={handleReset}
                    text='Reset settings'
                />
            </div>
        </div>
    );
}
