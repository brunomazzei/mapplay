import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ResetPasswordForm from './components/ResetPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router'

type ResetPasswordProps = {
    signInUrl?: string
}

export const ResetPasswordBase = ({
    signInUrl = '/sign-in',
}: ResetPasswordProps) => {
    const [resetComplete, setResetComplete] = useState(false)
    const [message, setMessage] = useTimeOutMessage()

    const navigate = useNavigate()

    return (
        <div>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">Senha redefinida!</h3>
                        <p className="font-semibold heading-text">
                            Sua senha foi alterada com sucesso
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Nova senha</h3>
                        <p className="font-semibold heading-text">
                            A nova senha deve ser diferente da anterior
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <ResetPasswordForm
                resetComplete={resetComplete}
                setMessage={setMessage}
                setResetComplete={setResetComplete}
            >
                <Button
                    block
                    variant="solid"
                    type="button"
                    onClick={() => navigate(signInUrl)}
                >
                    Ir para o login
                </Button>
            </ResetPasswordForm>
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

const ResetPassword = () => <ResetPasswordBase />

export default ResetPassword
