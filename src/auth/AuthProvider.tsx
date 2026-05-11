import { useRef, useImperativeHandle, useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    parseSignIn,
    parseSignUp,
    parseSignOut,
    parseForgotPassword as parseForgotPasswordService,
    parseCurrentUser,
    parseCurrentSessionToken,
} from '@/services/parse/authService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = ({ ref }: { ref: Ref<IsolatedNavigatorRef> }) => {
    const navigate = useNavigate()
    useImperativeHandle(ref, () => ({ navigate }), [navigate])
    return <></>
}

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn)
    const { token, setToken } = useToken()
    const [tokenState, setTokenState] = useState(token)

    // Restaura sessão Parse após o primeiro render (não durante o render)
    useEffect(() => {
        if (!appConfig.enableMock) {
            const currentUser = parseCurrentUser()
            const sessionToken = parseCurrentSessionToken()
            if (currentUser && sessionToken) {
                setUser(currentUser)
                setSessionSignedIn(true)
                setToken(sessionToken)
                setTokenState(sessionToken)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const authenticated = Boolean(tokenState && signedIn)

    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    const redirect = () => {
        const params = new URLSearchParams(window.location.search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)
        navigatorRef.current?.navigate(redirectUrl || appConfig.authenticatedEntryPath)
    }

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken)
        setTokenState(tokens.accessToken)
        setSessionSignedIn(true)
        if (user) setUser(user)
    }

    const handleSignOut = () => {
        setToken('')
        setTokenState('')
        setUser({})
        setSessionSignedIn(false)
    }

    const signIn = async (values: SignInCredential): AuthResult => {
        try {
            const resp = appConfig.enableMock
                ? await apiSignIn(values)
                : await parseSignIn(values)

            if (resp) {
                handleSignIn({ accessToken: resp.token }, resp.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Não foi possível entrar.' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            const msg =
                errors?.message ||
                errors?.response?.data?.message ||
                'E-mail ou senha incorretos.'
            return { status: 'failed', message: msg }
        }
    }

    const signUp = async (values: SignUpCredential): AuthResult => {
        try {
            const resp = appConfig.enableMock
                ? await apiSignUp(values)
                : await parseSignUp(values)

            if (resp) {
                handleSignIn({ accessToken: resp.token }, resp.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Não foi possível criar a conta.' }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            const msg =
                errors?.message ||
                errors?.response?.data?.message ||
                'Erro ao criar conta. O e-mail pode já estar em uso.'
            return { status: 'failed', message: msg }
        }
    }

    const signOut = async () => {
        try {
            if (appConfig.enableMock) {
                await apiSignOut()
            } else {
                await parseSignOut()
            }
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate('/')
        }
    }

    const oAuthSignIn = (callback: (payload: OauthSignInCallbackPayload) => void) => {
        callback({ onSignIn: handleSignIn, redirect })
    }

    return (
        <AuthContext.Provider value={{ authenticated, user, signIn, signUp, signOut, oAuthSignIn }}>
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider
