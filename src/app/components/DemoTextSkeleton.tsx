import styles from './DemoTextSkeleton.module.scss';
import clsx from 'clsx';

export default function DemoTextSkeleton() {
    return (
        <section className={styles["skel-cont"]}>
            <div className={clsx(styles["skel-tools"], styles["skel-clr"])}></div>
            <div className={styles["skel-txt"]}>
                {Array(2).fill(0).map((_, i) => {
                    return (
                        <div className={styles["skel-p"]} key={i}>
                            {Array(4).fill(0).map((_, j) => {
                                return (
                                    <p key={j} className={clsx(styles["skel-line"], styles["skel-clr"])}></p>
                                )
                            })
                            }
                        </div>
                    )
                })
                }
            </div>
        </section>
    )
}