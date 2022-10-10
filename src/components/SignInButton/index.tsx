import { FaMicrosoft } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss'
import { signIn, signOut, useSession } from 'next-auth/react'

export function SignInButton() {

    const { data: session } = useSession();
        
    return session ? (
        <button 
            type="button"
            className={styles.signInButton}
            onClick={() => signOut()}
        >
            <FaMicrosoft color="#9BF00B" />
            <span>{session.user.name}</span>
            <FiX color="#737380" className={styles.closeIcon} />
        </button>
    ) : (
        <button 
            type="button"
            className={styles.signInButton}
            onClick={() => signIn('azure-ad')}
        >
            <FaMicrosoft color="#737380" />
            <span>Login com Microsoft</span>
        </button>
    )
}