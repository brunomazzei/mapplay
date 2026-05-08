import Parse from '@/services/ParseConfig'
import { USER } from '@/constants/roles.constant'
import type { SignInCredential, SignUpCredential, User } from '@/@types/auth'

type GoogleFirebaseUser = {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
}

const parseUserToAppUser = (user: Parse.User): User => ({
    userId: user.id,
    userName: user.get('nome') ?? user.getUsername() ?? '',
    email: user.getEmail() ?? '',
    avatar: user.get('avatarUrl') ?? '',
    authority: user.get('authority') ?? [USER],
    bairro: user.get('bairro') ?? null,
    cidade: user.get('cidade') ?? null,
    esportes: user.get('esportes') ?? [],
})

export const parseSignIn = async ({ email, password }: SignInCredential) => {
    const user = await Parse.User.logIn(email, password)
    return {
        token: user.getSessionToken() ?? '',
        user: parseUserToAppUser(user),
    }
}

export const parseSignUp = async ({
    userName, email, password, bairro, cidade, esportes,
}: SignUpCredential) => {
    const user = new Parse.User()
    user.set('username', email)
    user.set('password', password)
    user.set('email', email)
    user.set('nome', userName)
    user.set('bairro', bairro)
    user.set('cidade', cidade ?? '')
    user.set('esportes', esportes)
    user.set('authority', [USER])

    const saved = await user.signUp()
    return {
        token: saved.getSessionToken() ?? '',
        user: parseUserToAppUser(saved),
    }
}

export const parseSignOut = async () => {
    await Parse.User.logOut()
}

export const parseForgotPassword = async (email: string) => {
    await Parse.User.requestPasswordReset(email)
}

export const parseCurrentUser = (): User | null => {
    const user = Parse.User.current()
    return user ? parseUserToAppUser(user) : null
}

export const parseCurrentSessionToken = (): string =>
    Parse.User.current()?.getSessionToken() ?? ''

/**
 * Cria ou recupera o usuário Parse vinculado a uma conta Google (Firebase).
 * Usa o UID do Firebase como username e password derivado — sempre consistente.
 */
export const parseGoogleSignIn = async ({
    uid,
    email,
    displayName,
    photoURL,
}: GoogleFirebaseUser) => {
    const username = `google_${uid}`
    const password = `gp_${uid}`

    try {
        // Tenta login (usuário já existe)
        const user = await Parse.User.logIn(username, password)
        return { token: user.getSessionToken() ?? '', user: parseUserToAppUser(user) }
    } catch {
        // Primeiro acesso — cria conta Parse vinculada ao Google
        const user = new Parse.User()
        user.set('username', username)
        user.set('password', password)
        if (email) user.set('email', email)
        user.set('nome', displayName ?? '')
        user.set('avatarUrl', photoURL ?? '')
        user.set('authority', [USER])
        user.set('authProvider', 'google')
        const saved = await user.signUp()
        return { token: saved.getSessionToken() ?? '', user: parseUserToAppUser(saved) }
    }
}
