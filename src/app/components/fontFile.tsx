import styles from '../page.module.scss';
import FontFileStyles from './fontFile.module.scss';

type FontFileProps = {
    name: string,
    onClick(event: React.MouseEvent<HTMLButtonElement>): void,
}

export default function FontFile(props: FontFileProps) {


    return (
        <div className={FontFileStyles['font-file']}>
            <img src="/font-file.svg" alt="Font file icon" width="24" height="24" />
            <span>{props.name}</span>
            <button
                className={styles.erase}
                title='Remove font file'
                tabIndex={-1} // button is not focusable
                onClick={props.onClick}
            ></button>
        </div>
    )
}