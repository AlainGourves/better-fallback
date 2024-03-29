import FontFileStyles from './fontFile.module.scss';
import CloseBtn from './form-components/closeBtn/closeBtn';
import { Icon } from './form-components/Icon';

type FontFileProps = {
    name: string,
    onClick(event: React.MouseEvent<HTMLButtonElement>): void,
}

export default function FontFile(props: FontFileProps) {


    return (
        <div className={FontFileStyles['font-file']}>
            <Icon name={'font-file'} className={FontFileStyles['icon']} />
            <span>{props.name}</span>
            <CloseBtn
                title='Remove font file'
                onClick={props.onClick}
            />
        </div>
    )
}