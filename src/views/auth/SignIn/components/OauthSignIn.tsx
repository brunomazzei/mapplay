import Button from '@/components/ui/Button'
import { useAuth } from '@/auth'
import { apiGoogleOauthSignIn } from '@/services/OAuthServices'
import { USER } from '@/constants/roles.constant'

type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()

    const handleGoogleSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ onSignIn, redirect }) => {
                try {
                    const resp = await apiGoogleOauthSignIn()
                    if (resp) {
                        const firebaseUser = resp.user as {
                            uid: string
                            displayName: string | null
                            email: string | null
                            photoURL: string | null
                        }
                        onSignIn(
                            { accessToken: resp.token },
                            {
                                userId: firebaseUser.uid,
                                userName: firebaseUser.displayName ?? '',
                                email: firebaseUser.email ?? '',
                                avatar: firebaseUser.photoURL ?? '',
                                authority: [USER],
                            },
                        )
                        redirect()
                    }
                } catch (error) {
                    setMessage?.(
                        'Não foi possível entrar com Google. Tente novamente.',
                    )
                    console.error(error)
                }
            })
        }
    }

    return (
        <Button
            block
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-2"
        >
            <img
                className="h-5 w-5"
                src="/img/others/google.png"
                alt="Google"
            />
            <span>Continuar com Google</span>
        </Button>
    )
}

export default OauthSignIn
