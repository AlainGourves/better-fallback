import { Icon } from '../Icon';
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
            type='button' // Important ! by default, in a form, a button will be of type 'submit'
            tabIndex={-1} // button is not focusable
            onClick={props.onClick}
        >
            <Icon name={'x-circle'} />
        </button>
    )
}