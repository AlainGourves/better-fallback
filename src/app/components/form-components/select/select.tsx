'use client'
import '../component-global.scss';
import selectStyles from './select.module.scss';
import { useRef } from 'react';
import { getClassName } from '../utils'

type Option = {
    value: string,
    text: string
}

type SelectProps = {
    id: string,
    label: string,
    options: Option[],
    defaultValue: string,
    onChange(event: any): void;
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
            className={className}>
            {props.label && props.label}
            <select
                id={props.id}
                name={props.id}
                ref={selectRef}
                onChange={props.onChange}
                defaultValue={props.defaultValue}
                disabled={props.disabled}
            >
                {
                    props.options.map((item: any, idx: any) => {
                        return (
                            <option key={idx} value={props.options[idx].value}>{props.options[idx].text}</option>
                        )
                    })
                }
            </select>
        </label>
    )
}