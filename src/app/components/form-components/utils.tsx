export const getClassName = (componentClass: string, position: string | undefined): string => {
    let className = `agf-component ${componentClass}`;
    if (position) {
        let labelPos: string | undefined = undefined;
        switch (position) {
            case 'top':
                labelPos = 'label-above';
                break;
            case 'right':
                labelPos = 'label-right';
                break;
            case 'bottom':
                labelPos = 'label-under';
                break;
            default:
                // 'left' is default position for the label
                break;
        }
        className += ` ${labelPos}`;
    }
    return className;
}