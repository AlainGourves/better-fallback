
import { useState, useEffect } from 'react';
import colorStyles from './colorInput.module.scss';
import { getClassName } from '../utils';

type ColorInputType = {
    id: string,
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function ColorInput(props: ColorInputType) {
    const [color, setColor] = useState('#ff0000');

    const className = getClassName(colorStyles['agf-colorinput'], undefined);

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setColor(ev.target.value);
    }

    useEffect(() => {
        document.body.style.setProperty('--fallback-color', `${color}`);
    }, [color]);

    return (
        <label
            htmlFor={props.id}
            className={className}
        >
            <span>Color</span>
            <input
                type='color'
                id={props.id}
                value={props.value}
                onChange={props.onChange}
            />
        </label>
    )
}