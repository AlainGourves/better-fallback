import { useRef } from 'react';
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

    const tooltipRef = useRef<HTMLElement>(null);

    const handleESCKey = (ev: KeyboardEvent) => {
        // ESC key should normally close the tooltip
        // -> https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role#description
        if (ev.code !== 'Escape') return;
        if (tooltipRef.current  && !tooltipRef.current.classList.contains('hidden')) {
            tooltipRef.current.classList.add('hidden');
        }
    }

    /*
        Note: containing element is a DIV, not a LABEL as it would make the tooltip clickable (unintentionnally more often than not!)
    */
    return (
        <div className={clsx(className, btnIconStyles['btn-icon'])}>
            <button
                type='button'
                id={id}
                onClick={onClick}
                aria-describedby={`${id}-tltp`}
                onMouseEnter={(e) => document.documentElement.addEventListener('keydown', handleESCKey)}
                onMouseLeave={(e) => {
                    document.documentElement.removeEventListener('keydown', handleESCKey);
                    if (tooltipRef.current) {
                        tooltipRef.current.classList.remove('hidden');
                    }
                }}
            >
                <Icon name={iconName} />
            </button>
            <span
                ref={tooltipRef}
                id={`${id}-tltp`}
                role='tooltip'
                className={'tooltip'}
            >{text}</span>
        </div>
    )
}