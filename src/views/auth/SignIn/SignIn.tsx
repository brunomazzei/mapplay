import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <>
            <div className="mb-8">
                <h2 className="mb-1 text-primary font-extrabold tracking-tight">
                    MapPlay
                </h2>
                <h4 className="mb-1">Bem-vindo de volta!</h4>
                <p className="font-semibold heading-text">
                    Entre na sua conta para continuar
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            to={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            Esqueci minha senha
                        </ActionLink>
                    </div>
                }
            />
            <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="border-t border-gray-200 dark:border-gray-700 flex-1" />
                    <span className="text-sm text-gray-400">ou</span>
                    <div className="border-t border-gray-200 dark:border-gray-700 flex-1" />
                </div>
                <OauthSignIn
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            </div>
            <div className="mt-6 text-center">
                <span>Não tem uma conta? </span>
                <ActionLink
                    to={signUpUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Cadastre-se
                </ActionLink>
            </div>
        </>
    )
}

const SignIn = () => <SignInBase />

export default SignIn
