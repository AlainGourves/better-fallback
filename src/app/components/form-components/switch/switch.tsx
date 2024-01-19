'use client'
import '../component-global.scss';
import switchStyles from './switch.module.scss';
import {getClassName} from '../utils'

type SwitchProps={
    id: string,
    label: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
    checked?: boolean | undefined,
    labelPosition?: 'top' | 'right' | 'bottom' | 'left',
    disabled?: boolean | undefined,
}

export default function Switch(props: SwitchProps) {

    const className = getClassName(switchStyles['agf-switch'], props.labelPosition);

    return (
        <label
            htmlFor={props.id}
            className={className}
        >
            {props.label && (<span>{props.label}</span>)}
            <input
                type='checkbox'
                role='switch'
                id={props.id}
                disabled={(props.disabled) ? props.disabled : undefined}
                aria-disabled={(props.disabled) ? props.disabled : undefined}
                checked={props.checked}
                onChange={props.onChange}
            />
        </label>
    )
}