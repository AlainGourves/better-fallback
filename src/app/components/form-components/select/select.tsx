'use client'
import '../component-global.scss';
import selectStyles from './select.module.scss';
import { useRef } from 'react';
import { getClassName } from '../utils'


type FallbackProps = {
    text: string;
    style: string;
}

type Fallbacks = {
    [fontName: string]: FallbackProps;
}

type SelectProps = {
    id: string,
    label: string,
    options: Fallbacks,
    value: string,
    onChange(event: React.FormEvent<HTMLSelectElement>): void;
    disabled?: boolean,
    labelPosition?: 'top' | 'right' | 'bottom' | 'left',
    classAdd?: string | string[] | undefined
}


export default function Select(props: SelectProps) {
    const selectRef = useRef<HTMLSelectElement | null>(null);

    let className = getClassName(selectStyles['agf-select'], props.labelPosition);

    if (props.classAdd) {
        className += ' ';
        if (typeof props.classAdd === 'string') {
            className += selectStyles[`agf-select-${props.classAdd}`];
        }
        if (Array.isArray(props.classAdd)) {
            className += props.classAdd.map((cls: string) => selectStyles[`agf-select-${cls}`]).join(' ');
        }
    }

    return (
        <label
            htmlFor={props.id}
            className={className}
        >
            {props.label && (<span>{props.label}</span>)}
            <select
                id={props.id}
                name={props.id}
                ref={selectRef}
                onChange={props.onChange}
                value={props.value && props.value}
                disabled={props.disabled}
            >
                {
                    [...Object.getOwnPropertyNames(props.options)].map((item, idx) => {
                        return (
                            <option key={idx} value={item}>
                                {props.options[item]?.text}
                            </option>
                        )
                    })
                }
            </select>
        </label>
    )
}