import Link from 'next/link'
import getCurrentLanguage from '../../utils/localization';
import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss'

export function Header({lang}) {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <a className={styles.logo}>
                        <img src="/images/Logo.png" alt="Mundo Xbox" />
                    </a>
                </Link>
                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>{getCurrentLanguage(lang).home}</a>
                    </ActiveLink>

                    <div>
                        <Link href="/" locale="pt-br" hrefLang="pt-br">
                            <a className={styles.localeSelector}>
                                <img src="/images/brasil.png" alt="Português" />
                            </a>
                        </Link>

                        <Link href="/" locale="ja-jp" hrefLang="ja-jp">
                            <a className={styles.localeSelector}>
                                <img src="/images/nihon.png" alt="日本語" />
                            </a>
                        </Link>
                        <SignInButton />
                    </div>
                </nav>
            </div>
        </header>
    )
}