import clsx from 'clsx';
import btnIconStyles from './btnIcon.module.scss';
import { Icon } from '../Icon';
import { type IconName } from "../../../../../types/name";

type PropsType = {
    id: string,
    iconName: IconName,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    text: string,
    className?: string
}

export default function BtnIcon({ id, iconName, onClick, text, className }: PropsType) {


    return (
        <label htmlFor={id} className={clsx(className, btnIconStyles['btn-icon'])}>
            <button
                type='button'
                id={id}
                onClick={onClick}
            >
                <Icon name={iconName} />
            </button>
            <span className={btnIconStyles['tooltip']}>{text}</span>
        </label>
    )
}