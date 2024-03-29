'use client';
import '../component-global.scss';
import textInputStyle from './textInput.module.scss';
import CloseBtn from '../closeBtn/closeBtn';
import { getClassName } from '../utils'
import { forwardRef } from 'react';

type TextInputProps = {
    id: string,
    label?: string | null,
    type?: 'text' | 'url',
    value: string | undefined,
    placeholder?: string | undefined,
    labelPosition?: 'top' | 'right' | 'bottom' | 'left',
    disabled?: boolean | undefined,
    readOnly?: boolean | undefined,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    onClick(event: React.MouseEvent<HTMLButtonElement>): void,
    onBlur?: React.FocusEventHandler<HTMLInputElement>,
    title: string,
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
                type={props.type ? props.type : 'text'}
                id={props.id}
                name={props.id}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                disabled={props.disabled}
                readOnly={props.readOnly}
                placeholder={props.placeholder ?? props.placeholder}
            />

            {props.value && <CloseBtn
                title={props.title}
                onClick={props.onClick}
            />}
        </label>
    )
});

export default TextInput;