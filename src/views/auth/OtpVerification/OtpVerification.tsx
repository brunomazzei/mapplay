import Alert from '@/components/ui/Alert'
import OtpVerificationForm from './components/OtpVerificationForm'
import sleep from '@/utils/sleep'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

export const OtpVerificationBase = () => {
    const [otpVerified, setOtpVerified] = useTimeOutMessage()
    const [otpResend, setOtpResend] = useTimeOutMessage()
    const [message, setMessage] = useTimeOutMessage()

    const handleResendOtp = async () => {
        try {
            await sleep(500)
            setOtpResend('Código reenviado para o seu e-mail.')
        } catch (errors) {
            setMessage?.(
                typeof errors === 'string' ? errors : 'Ocorreu um erro.',
            )
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h3 className="mb-2">Verificação de e-mail</h3>
                <p className="font-semibold heading-text">
                    Enviamos um código de verificação para o seu e-mail.
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            {otpResend && (
                <Alert showIcon className="mb-4" type="info">
                    <span className="break-all">{otpResend}</span>
                </Alert>
            )}
            {otpVerified && (
                <Alert showIcon className="mb-4" type="success">
                    <span className="break-all">{otpVerified}</span>
                </Alert>
            )}
            <OtpVerificationForm
                setMessage={setMessage}
                setOtpVerified={setOtpVerified}
            />
            <div className="mt-4 text-center">
                <span className="font-semibold">Não recebeu o código? </span>
                <button
                    className="heading-text font-bold underline"
                    onClick={handleResendOtp}
                >
                    Reenviar
                </button>
            </div>
        </div>
    )
}

const OtpVerification = () => <OtpVerificationBase />

export default OtpVerification
