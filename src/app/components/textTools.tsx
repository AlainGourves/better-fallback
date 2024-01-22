import { useEffect, useState } from 'react';
import styles from '../page.module.scss';
import Slider from './form-components/slider/slider';
import Switch from './form-components/switch/switch';

export default function TextTools(props: any) {
    const [alphaSlider, setAlphaSlider] = useState(.5);
    const [fontSizeSlider, setFontSizeSlider] = useState(16);
    const [FMOSwitch, setFMOSwitch] = useState(true);

    const handleAlphaSlider = (ev:any)=>{
        setAlphaSlider(parseFloat(ev.target.value));
    }

    const handleFontSizeSlider = (ev:any)=>{
        setFontSizeSlider(parseInt(ev.target.value));
    }

    const handleFMOSwitch = (ev:any)=>{
        setFMOSwitch(ev.target?.checked);
    }

    useEffect(()=>{
        document.body.style.setProperty('--fallback-opacity', alphaSlider.toString())
    }, [alphaSlider])

    useEffect(()=>{
        document.body.style.setProperty('--temoin-fs', `${fontSizeSlider}px`)
    }, [fontSizeSlider])

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
                    checked={FMOSwitch  }
                    onChange={handleFMOSwitch}
                />
            </div>
        </div>
    );
}
