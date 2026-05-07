import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router'

type ForgotPasswordProps = {
    signInUrl?: string
}

export const ForgotPasswordBase = ({
    signInUrl = '/sign-in',
}: ForgotPasswordProps) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const navigate = useNavigate()

    return (
        <div>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-2">Verifique seu e-mail</h3>
                        <p className="font-semibold heading-text">
                            Enviamos um link de recuperação para o seu e-mail
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-2">Esqueci minha senha</h3>
                        <p className="font-semibold heading-text">
                            Digite seu e-mail para receber um link de
                            recuperação
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ForgotPasswordForm
                emailSent={emailSent}
                setMessage={setMessage}
                setEmailSent={setEmailSent}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={() => navigate(signInUrl)}
                >
                    Continuar
                </Button>
            </ForgotPasswordForm>
            <div className="mt-4 text-center">
                <span>Voltar para </span>
                <ActionLink
                    to={signInUrl}
                    className="heading-text font-bold"
                    themeColor={false}
                >
                    Entrar
                </ActionLink>
            </div>
        </div>
    )
}

const ForgotPassword = () => <ForgotPasswordBase />

export default ForgotPassword
