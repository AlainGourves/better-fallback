
'use client'
import '../component-global.scss';
import sliderStyles from './slider.module.scss';
import {getClassName} from '../utils'

type SliderProps = {
    id: string,
    value: number,
    min: number,
    max: number,
    label?: string | null,
    labelPosition?: 'top' | 'right' | 'bottom' | 'left',
    isOutput?: boolean | undefined,
    disabled?: boolean | undefined,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function Slider({ id, value, min, max, label, labelPosition, isOutput = undefined, disabled=undefined, onChange }: SliderProps) {

    const className = getClassName(sliderStyles['agf-slider'], labelPosition);

    // "normamize" the slider's value between 0 & 100
    const lerp = (val: number) => {
        return (100 * (val - min)) / (max - min);
    }

    return (
        <>
            <label
                htmlFor={id}
                className={className}
                style={{ '--slider-value': `${lerp(value)}` } as React.CSSProperties}
            >
                <span>{label}</span>
                <div>
                    <input
                        type='range'
                        role='slider'
                        id={id}
                        min={min}
                        max={max}
                        defaultValue={value}
                        disabled={disabled}
                        onChange={onChange}
                    />
                    {isOutput ? <output>{value}</output> : null}
                </div>
            </label>
        </>
    )
}