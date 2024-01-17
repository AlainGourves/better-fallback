'use client';
import '../component-global.scss';
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

export default function Button(props: ButtonProps) {

    let className = `agf-component ${buttonStyle['agf-btn']} `;

    if (props.classAdd) {
        if (typeof props.classAdd === 'string') {
            className += buttonStyle[`agf-btn-${props.classAdd}`];
        }
        if (Array.isArray(props.classAdd)) {
            className += props.classAdd.map((cls: string) => buttonStyle[`agf-btn-${cls}`]).join(' ');
        }
    }

    return (
        <button
            className={className}
            disabled={props.disabled}
            {...props}
        >
            {props.text}
        </button>
    )
}