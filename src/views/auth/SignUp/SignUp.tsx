import Alert from '@/components/ui/Alert'
import SignUpForm from './components/SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <>
            <div className="mb-8">
                <h2 className="mb-1 text-primary font-extrabold tracking-tight">
                    MapPlay
                </h2>
                <h4 className="mb-1">Crie sua conta</h4>
                <p className="font-semibold heading-text">
                    Junte-se à comunidade esportiva da sua cidade
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignUpForm disableSubmit={disableSubmit} setMessage={setMessage} />
            <div className="mt-6 text-center">
                <span>Já tem uma conta? </span>
                <ActionLink
                    to={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Entrar
                </ActionLink>
            </div>
        </>
    )
}

const SignUp = () => <SignUpBase />

export default SignUp
