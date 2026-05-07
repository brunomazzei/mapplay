import Parse from '@/services/ParseConfig'
import { USER } from '@/constants/roles.constant'
import type { SignInCredential, SignUpCredential, User } from '@/@types/auth'

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
