import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import LocalizacaoSearch from '@/components/shared/LocalizacaoSearch'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import classNames from 'classnames'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type SignUpFormSchema = {
    userName: string
    email: string
    bairro: string
    cidade: string
    esportes: string[]
    password: string
    confirmPassword: string
}

const SPORTS = [
    { key: 'basquete', label: 'Basquete', emoji: '🏀' },
    { key: 'futebol', label: 'Futebol', emoji: '⚽' },
    { key: 'skate', label: 'Skate', emoji: '🛹' },
]

const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        userName: z
            .string({ required_error: 'Informe seu nome' })
            .min(2, { message: 'Nome deve ter ao menos 2 caracteres' }),
        email: z
            .string({ required_error: 'Informe seu e-mail' })
            .email({ message: 'E-mail inválido' }),
        bairro: z.string().optional().default(''),
        cidade: z
            .string({ required_error: 'Selecione uma cidade' })
            .min(2, { message: 'Selecione uma cidade válida' }),
        esportes: z
            .array(z.string())
            .min(1, { message: 'Selecione ao menos um esporte' }),
        password: z
            .string({ required_error: 'Crie uma senha' })
            .min(6, { message: 'A senha deve ter ao menos 6 caracteres' }),
        confirmPassword: z.string({ required_error: 'Confirme sua senha' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props

    const [isSubmitting, setSubmitting] = useState(false)

    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: { esportes: [], bairro: '', cidade: '' },
    })

    const selectedSports = watch('esportes')

    const toggleSport = (key: string) => {
        const current = selectedSports ?? []
        const next = current.includes(key)
            ? current.filter((s) => s !== key)
            : [...current, key]
        setValue('esportes', next, { shouldValidate: true })
    }

    const onSignUp = async (values: SignUpFormSchema) => {
        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({
                userName: values.userName,
                email: values.email,
                password: values.password,
                bairro: values.bairro,
                cidade: values.cidade,
                esportes: values.esportes,
            })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignUp)}>
                <FormItem
                    label="Nome completo"
                    invalid={Boolean(errors.userName)}
                    errorMessage={errors.userName?.message}
                >
                    <Controller
                        name="userName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Seu nome"
                                autoComplete="name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="E-mail"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                autoComplete="email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Bairro / Cidade"
                    invalid={Boolean(errors.cidade)}
                    errorMessage={errors.cidade?.message}
                    extra={
                        <span className="text-xs text-gray-400">
                            via OpenStreetMap
                        </span>
                    }
                >
                    <Controller
                        name="cidade"
                        control={control}
                        render={() => (
                            <LocalizacaoSearch
                                invalid={Boolean(errors.cidade)}
                                placeholder="Ex: Vila Madalena, São Paulo..."
                                onChange={({ bairro, cidade }) => {
                                    setValue('bairro', bairro, {
                                        shouldValidate: true,
                                    })
                                    setValue('cidade', cidade, {
                                        shouldValidate: true,
                                    })
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Esportes que você pratica"
                    invalid={Boolean(errors.esportes)}
                    errorMessage={errors.esportes?.message}
                >
                    <div className="flex gap-2">
                        {SPORTS.map((sport) => (
                            <button
                                key={sport.key}
                                type="button"
                                onClick={() => toggleSport(sport.key)}
                                className={classNames(
                                    'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-medium transition-colors',
                                    selectedSports?.includes(sport.key)
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400',
                                )}
                            >
                                <span className="text-2xl">{sport.emoji}</span>
                                <span>{sport.label}</span>
                            </button>
                        ))}
                    </div>
                </FormItem>

                <FormItem
                    label="Senha"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                placeholder="Mínimo 6 caracteres"
                                autoComplete="new-password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Confirmar senha"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <PasswordInput
                                placeholder="Repita a senha"
                                autoComplete="new-password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Criando conta...' : 'Criar conta'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
