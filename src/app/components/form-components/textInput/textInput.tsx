'use client';
import '../component-global.scss';
import textInputStyle from './textInput.module.scss';
import { getClassName } from '../utils'

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

export default function TextInput(props: TextInputProps) {

    // TODO: traiter le onSubmit

    const className = getClassName(textInputStyle['agf-textinput'], props.labelPosition);

    return (
        <label htmlFor={props.id}
            className={className}
        >
            {props.label && (<span>props.label</span>)}

            <input
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
}