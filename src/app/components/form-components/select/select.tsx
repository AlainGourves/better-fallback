'use client'
import '../component-global.scss';
import selectStyles from './select.module.scss';
import { useRef } from 'react';
import { getClassName } from '../utils'

type OptionVal={
    text:string,
    style: string
}
type Option={
    [key: string]: OptionVal
}

type SelectProps = {
    id: string,
    label: string,
    options: Map<string, OptionVal>,
    defaultValue?: string,
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
                defaultValue={props.defaultValue && props.defaultValue}
                disabled={props.disabled}
            >
                {
                    [...props.options.keys()].map((item, idx) => {
                        return (
                            <option key={idx} value={item}>{props.options.get(item)?.text}</option>
                        )
                    })

                }
            </select>
        </label>
    )
}