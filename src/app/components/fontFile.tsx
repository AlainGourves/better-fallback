import styles from '../page.module.scss';
import FontFileStyles from './fontFile.module.scss';
import CloseBtn from './form-components/closeBtn/closeBtn';

type FontFileProps = {
    name: string,
    onClick(event: React.MouseEvent<HTMLButtonElement>): void,
}

export default function FontFile(props: FontFileProps) {


    return (
        <div className={FontFileStyles['font-file']}>
            <img src="/font-file.svg" alt="Font file icon" width="24" height="24" />
            <span>{props.name}</span>
            <CloseBtn
            title='Remove font file'
            onClick={props.onClick}
            />
        </div>
    )
}