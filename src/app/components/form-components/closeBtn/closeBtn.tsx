import closeBtnStyles from './closeBtn.module.scss';

type CloseBtnProps = {
    title: string,
    onClick(event: React.MouseEvent<HTMLButtonElement>): void,
}

export default function CloseBtn(props: CloseBtnProps) {

    return (
        <button
            className={closeBtnStyles['close-btn']}
            title={props.title}
            tabIndex={-1} // button is not focusable
            onClick={props.onClick}
        ></button>
    )
}