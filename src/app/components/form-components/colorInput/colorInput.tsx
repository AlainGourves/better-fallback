
import colorStyles from './colorInput.module.scss';
import { getClassName } from '../utils';

type ColorInputType = {
    id: string,
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function ColorInput(props: ColorInputType) {

    const className = getClassName(colorStyles['agf-colorinput'], undefined);

    return (
        <label
            htmlFor={props.id}
            className={className}
        >
            <span>Color</span>
            <input
                type='color'
                id={props.id}
                value={props.value}
                onChange={props.onChange}
            />
        </label>
    )
}