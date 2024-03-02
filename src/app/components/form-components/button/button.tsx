'use client';
import { forwardRef } from 'react';
import '../component-global.scss'; //TODO: qu'est-ce que ça fout là ?
import buttonStyle from './button.module.scss';

type ButtonPropsBase = {
    text: string,
    id?: string,
    disabled?: boolean | undefined,
    classAdd?: string | string[] | undefined,
}
type ButtonPropsButton = ButtonPropsBase & {
    type: "button",
    onClick(event: React.MouseEvent<HTMLButtonElement>): void
}
type ButtonPropsSubmit = ButtonPropsBase & {
    type: "submit",
}
type ButtonProps = ButtonPropsButton | ButtonPropsSubmit;

type Ref = HTMLButtonElement;

const Button = forwardRef<Ref, ButtonProps>((props, ref) => {

    let className = `agf-component ${buttonStyle['agf-btn']} `;
    const {classAdd, ...rest} = props;

    if (classAdd) {
        if (typeof classAdd === 'string') {
            className += buttonStyle[`agf-btn-${classAdd}`];
        }
        if (Array.isArray(classAdd)) {
            className += classAdd.map((cls: string) => buttonStyle[`agf-btn-${cls}`]).join(' ');
        }
    }

    return (
        <button
            ref={ref ? ref: null}
            className={className}
            disabled={props.disabled}
            {...rest}
        >
            {props.text}
        </button>
    )
});

// To prevent eslint errors
Button.displayName='Button';


export default Button;