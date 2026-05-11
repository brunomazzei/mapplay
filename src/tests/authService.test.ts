import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks hoisted (disponíveis no vi.mock factory) ─────────────────────────
const { setMock, signUpMock, mockUser, mockSavedUser } = vi.hoisted(() => {
    const setMock = vi.fn()
    const signUpMock = vi.fn()

    const mockUser = {
        id: 'user123',
        getSessionToken: () => 'session-token-abc',
        getEmail: () => 'test@example.com',
        getUsername: () => 'testuser',
        get: (key: string) => {
            const data: Record<string, unknown> = {
                nome: 'Test User',
                avatarUrl: '',
                authority: ['USER'],
                bairro: null,
                cidade: null,
                esportes: [],
            }
            return data[key]
        },
    }

    const mockSavedUser = {
        id: 'newuser456',
        getSessionToken: () => 'session-token-new',
        getEmail: () => 'google@example.com',
        getUsername: () => 'google_uid123',
        get: (key: string) => {
            const data: Record<string, unknown> = {
                nome: 'Google User',
                avatarUrl: '',
                authority: ['USER'],
                bairro: null,
                cidade: null,
                esportes: [],
            }
            return data[key]
        },
    }

    return { setMock, signUpMock, mockUser, mockSavedUser }
})

// ─── Mock do Parse (User como construtor com function) ───────────────────────
vi.mock('@/services/ParseConfig', () => {
    // Construtor real usando function (não arrow) — necessário para "new Parse.User()"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const UserClass = vi.fn(function (this: any) {
        this.set = setMock
        this.signUp = signUpMock.mockResolvedValue(mockSavedUser)
        this.setACL = vi.fn()
    })

    // Métodos estáticos do Parse.User
    ;(UserClass as unknown as Record<string, unknown>).logIn = vi.fn()
    ;(UserClass as unknown as Record<string, unknown>).logOut = vi.fn()
    ;(UserClass as unknown as Record<string, unknown>).current = vi.fn()
    ;(UserClass as unknown as Record<string, unknown>).requestPasswordReset = vi.fn()

    return { default: { User: UserClass } }
})

import Parse from '@/services/ParseConfig'
import {
    parseSignIn,
    parseSignOut,
    parseForgotPassword,
    parseCurrentUser,
    parseGoogleSignIn,
} from '@/services/parse/authService'

const ParseUser = Parse.User as unknown as ReturnType<typeof vi.fn> & {
    logIn: ReturnType<typeof vi.fn>
    logOut: ReturnType<typeof vi.fn>
    current: ReturnType<typeof vi.fn>
    requestPasswordReset: ReturnType<typeof vi.fn>
}

// ─── parseSignIn ───────────────────────────────────────────────
describe('parseSignIn', () => {
    beforeEach(() => vi.clearAllMocks())

    it('retorna token e dados do usuário quando credenciais são válidas', async () => {
        ParseUser.logIn.mockResolvedValueOnce(mockUser)

        const result = await parseSignIn({ email: 'test@example.com', password: '123456' })

        expect(ParseUser.logIn).toHaveBeenCalledWith('test@example.com', '123456')
        expect(result.token).toBe('session-token-abc')
        expect(result.user.email).toBe('test@example.com')
        expect(result.user.userId).toBe('user123')
    })

    it('propaga erro quando credenciais são inválidas', async () => {
        ParseUser.logIn.mockRejectedValueOnce(new Error('Invalid credentials'))

        await expect(
            parseSignIn({ email: 'wrong@email.com', password: 'wrong' }),
        ).rejects.toThrow('Invalid credentials')
    })
})

// ─── parseGoogleSignIn ─────────────────────────────────────────
describe('parseGoogleSignIn', () => {
    beforeEach(() => vi.clearAllMocks())

    const googleUser = {
        uid: 'firebase-uid-123',
        email: 'google@example.com',
        displayName: 'Google User',
        photoURL: 'https://photo.url/img.jpg',
    }

    it('retorna sessão existente quando usuário Google já está registrado', async () => {
        ParseUser.logIn.mockResolvedValueOnce(mockUser)

        const result = await parseGoogleSignIn(googleUser)

        expect(ParseUser.logIn).toHaveBeenCalledWith(
            'google_firebase-uid-123',
            'gp_firebase-uid-123',
        )
        expect(result.token).toBe('session-token-abc')
        expect(result.user.userId).toBe('user123')
    })

    it('cria novo usuário Parse quando é o primeiro login Google', async () => {
        ParseUser.logIn.mockRejectedValueOnce(new Error('User not found'))
        signUpMock.mockResolvedValueOnce(mockSavedUser)

        const result = await parseGoogleSignIn(googleUser)

        expect(ParseUser.logIn).toHaveBeenCalledOnce()
        expect(ParseUser).toHaveBeenCalledOnce() // construtor chamado
        expect(result.token).toBe('session-token-new')
        expect(result.user.userId).toBe('newuser456')
    })

    it('usa username derivado do UID do Firebase', async () => {
        ParseUser.logIn.mockResolvedValueOnce(mockUser)

        await parseGoogleSignIn({ ...googleUser, uid: 'abc-xyz' })

        expect(ParseUser.logIn).toHaveBeenCalledWith('google_abc-xyz', 'gp_abc-xyz')
    })

    it('define email e nome do Google no novo usuário Parse', async () => {
        ParseUser.logIn.mockRejectedValueOnce(new Error('Not found'))
        signUpMock.mockResolvedValueOnce(mockSavedUser)

        await parseGoogleSignIn(googleUser)

        expect(setMock).toHaveBeenCalledWith('email', 'google@example.com')
        expect(setMock).toHaveBeenCalledWith('nome', 'Google User')
        expect(setMock).toHaveBeenCalledWith('authProvider', 'google')
    })
})

// ─── parseSignOut ──────────────────────────────────────────────
describe('parseSignOut', () => {
    it('chama Parse.User.logOut', async () => {
        ParseUser.logOut.mockResolvedValueOnce(undefined)

        await parseSignOut()

        expect(ParseUser.logOut).toHaveBeenCalledOnce()
    })
})

// ─── parseForgotPassword ───────────────────────────────────────
describe('parseForgotPassword', () => {
    it('chama requestPasswordReset com o email correto', async () => {
        ParseUser.requestPasswordReset.mockResolvedValueOnce(undefined)

        await parseForgotPassword('test@example.com')

        expect(ParseUser.requestPasswordReset).toHaveBeenCalledWith('test@example.com')
    })
})

// ─── parseCurrentUser ──────────────────────────────────────────
describe('parseCurrentUser', () => {
    it('retorna null quando não há usuário logado', () => {
        ParseUser.current.mockReturnValueOnce(null)

        const result = parseCurrentUser()

        expect(result).toBeNull()
    })

    it('retorna dados do usuário quando há sessão ativa', () => {
        ParseUser.current.mockReturnValueOnce(mockUser)

        const result = parseCurrentUser()

        expect(result).not.toBeNull()
        expect(result?.userId).toBe('user123')
        expect(result?.email).toBe('test@example.com')
    })
})
