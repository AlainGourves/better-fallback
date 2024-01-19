'use client';
import '../component-global.scss';
import textInputStyle from './textInput.module.scss';
import { getClassName } from '../utils'
import { forwardRef } from 'react';

type TextInputProps = {
    id: string,
    label?: string | null,
    value: string | undefined,
    placeholder?: string | undefined,
    labelPosition?: 'top' | 'right' | 'bottom' | 'left',
    disabled?: boolean | undefined,
    readOnly?: boolean | undefined,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
}

const TextInput = forwardRef(function TextInput(props: TextInputProps, ref: React.Ref<HTMLInputElement>) {

    const className = getClassName(textInputStyle['agf-textinput'], props.labelPosition);

    return (
        <label htmlFor={props.id}
            className={className}
        >
            {props.label && (<span>{props.label}</span>)}

            <input
                ref={ref}
                type="text"
                id={props.id}
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                readOnly={props.readOnly}
                placeholder={props.placeholder ?? props.placeholder}
            />
        </label>
    )
});

export default TextInput;