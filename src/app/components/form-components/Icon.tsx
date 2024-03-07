import { type SVGProps } from "react";
import clsx from "clsx";
import { type IconName } from "../../../../types/name";
import styles from './Icon.module.scss';

export { IconName };

export function Icon({
    name,
    childClassName,
    className,
    children,
    ...props
}: SVGProps<SVGSVGElement> & {
    name: IconName;
    childClassName?: string;
}) {

    // TODO: voir si c'est utile de rajouter des classes "globalement" avec clsx
    if (children) {
        return (
            <span
                className={clsx(``, childClassName)}
            >
                <Icon name={name} className={className} {...props} />
                {children}
            </span>
        );
    }
    return (
        <svg
            {...props}
            className={clsx(styles['icon'], className)}
        >
            <use href={`./svg-icons/sprite.svg#${name}`} />
        </svg>
    );
}