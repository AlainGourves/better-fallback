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
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <radialGradient id="a" cx="77" cy="22" gradientTransform="matrix(.73 .69 -.33 .35 28 -38)" gradientUnits="userSpaceOnUse" r="22.5">
                    <stop offset="0" stop-opacity=".4" />
                    <stop offset=".9" stop-opacity="0" />
                </radialGradient>
                <path d="M58.23 5H95v36.61z" fill="url(#a)" />
                <path d="M90.68 32.32 66.67 8.65c-2.47-2.85-4.8-3.68-8.37-3.68-.14 0-.27.02-.41.03H13a8 8 0 0 0-8 8v74a8 8 0 0 0 8 8h74a8 8 0 0 0 8-8V41.73c0-3.8-1.07-6.61-4.32-9.41z" fill="#d7dfc7" />
                <path d="M52.01 77.33v-3.3l2.38-.32c.83-.11 1.58-.23 2.25-.36s1.22-.29 1.65-.48.64-.39.64-.6c0-.27-.07-.58-.2-.93l-.44-1.17-3.54-9.82c-.21-.59-.75-1.01-1.61-1.25s-1.75-.36-2.66-.36H38.73c-1.72 0-2.77.54-3.14 1.61l-2.58 8.21c-.11.27-.19.56-.24.89a6.8 6.8 0 0 0-.08 1.05c0 2.09 2.28 3.14 6.84 3.14v3.7H20.78v-3.7c3.01-.21 5.23-2.04 6.68-5.47l19.08-45.5 7.49 1.05L72.79 70.9c.21.59.56 1.07 1.05 1.45.48.38 1.03.67 1.65.89a15.55 15.55 0 0 0 3.74.8v3.3H52.02zm-6.44-41.46-6.36 15.38a8.99 8.99 0 0 0-.89 2.42c0 .43.83.64 2.5.64h9.9c1.29 0 1.93-.11 1.93-.32 0-.27-.51-1.72-1.53-4.35l-5.56-13.77z" fill="#16180e" opacity=".9" />
                <path d="M66.68 8.66c2.67 2.63 4.37 6.42 5.15 10.29s3.71 6.8 7.45 7.69c4.18.99 8.23 2.85 11.4 5.69L66.67 8.66z" fill="#f0f3eb" />
            </svg>
            <span>{props.name}</span>
            <CloseBtn
                title='Remove font file'
                onClick={props.onClick}
            />
        </div>
    )
}