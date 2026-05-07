import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HiArrowLeft, HiOutlineInformationCircle } from 'react-icons/hi2'
import classNames from 'classnames'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import { useEventoStore } from '@/store/eventoStore'
import { useEspacoStore } from '@/store/espacoStore'
import type { TipoEvento } from '@/types/evento'

const schema = z.object({
    tipo: z.enum(['esportivo', 'mutirao']),
    nome: z.string().min(5, 'Nome deve ter ao menos 5 caracteres'),
    espacoId: z.string().min(1, 'Selecione um espaço'),
    data: z.string().min(1, 'Informe a data'),
    hora: z.string().min(1, 'Informe o horário'),
    vagas: z.coerce.number().min(2, 'Mínimo 2 vagas').max(100),
    descricao: z.string().min(10, 'Descreva o evento em ao menos 10 caracteres'),
    aceitaRN05: z.boolean().optional(),
}).refine(
    (data) => data.tipo !== 'mutirao' || data.aceitaRN05 === true,
    { message: 'Confirme o termo de responsabilidade', path: ['aceitaRN05'] },
)

type FormSchema = z.infer<typeof schema>

const TIPO_CONFIG = {
    esportivo: { emoji: '🏃', label: 'Esportivo', desc: 'Pelada, rolê, jogo', color: 'border-primary bg-primary/10 text-primary' },
    mutirao: { emoji: '🤝', label: 'Mutirão', desc: 'Revitalização e zeladoria', color: 'border-purple-500 bg-purple-50 text-purple-700' },
}

const EventCreate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const addEvento = useEventoStore((s) => s.addEvento)
    const espacos = useEspacoStore((s) =>
        s.espacos.filter((e) => e.status === 'validado'),
    )
    const [isSubmitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            tipo: 'esportivo',
            espacoId: searchParams.get('espacoId') ?? '',
            vagas: 10,
            aceitaRN05: false,
        },
    })

    const tipo = watch('tipo')
    const selectedEspaco = watch('espacoId')

    const onSubmit = async (data: FormSchema) => {
        setSubmitting(true)
        await new Promise((r) => setTimeout(r, 600))

        const espaco = espacos.find((e) => e.id === data.espacoId)
        const id = addEvento({
            tipo: data.tipo as TipoEvento,
            nome: data.nome,
            espacoId: data.espacoId,
            modalidade: data.tipo === 'esportivo' ? espaco?.modalidade : undefined,
            data: data.data,
            hora: data.hora,
            vagas: data.vagas,
            descricao: data.descricao,
        })

        setSubmitting(false)
        navigate(`/evento/${id}`)
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                    <HiArrowLeft className="text-xl text-gray-700" />
                </button>
                <div>
                    <h4 className="font-bold text-gray-900">Criar evento</h4>
                    <p className="text-xs text-gray-500">em espaço público validado</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
                <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* Tipo */}
                    <FormItem label="Tipo de evento" invalid={Boolean(errors.tipo)} errorMessage={errors.tipo?.message}>
                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field }) => (
                                <div className="flex gap-2">
                                    {(Object.keys(TIPO_CONFIG) as TipoEvento[]).map((t) => {
                                        const cfg = TIPO_CONFIG[t]
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => field.onChange(t)}
                                                className={classNames(
                                                    'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-medium transition-colors',
                                                    field.value === t ? cfg.color : 'border-gray-200 text-gray-500',
                                                )}
                                            >
                                                <span className="text-2xl">{cfg.emoji}</span>
                                                <span>{cfg.label}</span>
                                                <span className="text-xs font-normal opacity-70">{cfg.desc}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        />
                    </FormItem>

                    {/* Nome */}
                    <FormItem label="Nome do evento" invalid={Boolean(errors.nome)} errorMessage={errors.nome?.message}>
                        <Controller
                            name="nome"
                            control={control}
                            render={({ field }) => (
                                <Input placeholder={tipo === 'mutirao' ? 'Ex: Mutirão Praça Central' : 'Ex: Pelada das 16h'} {...field} />
                            )}
                        />
                    </FormItem>

                    {/* Espaço */}
                    <FormItem label="Espaço vinculado" invalid={Boolean(errors.espacoId)} errorMessage={errors.espacoId?.message}>
                        <Controller
                            name="espacoId"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                    {espacos.map((e) => (
                                        <button
                                            key={e.id}
                                            type="button"
                                            onClick={() => field.onChange(e.id)}
                                            className={classNames(
                                                'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors',
                                                field.value === e.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-100 hover:border-gray-200',
                                            )}
                                        >
                                            <span className="text-xl">
                                                {e.modalidade === 'basquete' ? '🏀' : e.modalidade === 'futebol' ? '⚽' : '🛹'}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{e.nome}</p>
                                                {e.bairro && <p className="text-xs text-gray-500">{e.bairro}, {e.cidade}</p>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </FormItem>

                    {/* Data e hora */}
                    <div className="flex gap-3">
                        <FormItem label="Data" className="flex-1" invalid={Boolean(errors.data)} errorMessage={errors.data?.message}>
                            <Controller
                                name="data"
                                control={control}
                                render={({ field }) => (
                                    <Input type="date" {...field} />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Hora" className="flex-1" invalid={Boolean(errors.hora)} errorMessage={errors.hora?.message}>
                            <Controller
                                name="hora"
                                control={control}
                                render={({ field }) => (
                                    <Input type="time" {...field} />
                                )}
                            />
                        </FormItem>
                    </div>

                    {/* Vagas */}
                    <FormItem label="Número de vagas" invalid={Boolean(errors.vagas)} errorMessage={errors.vagas?.message}>
                        <Controller
                            name="vagas"
                            control={control}
                            render={({ field }) => (
                                <Input type="number" min={2} max={100} {...field} />
                            )}
                        />
                    </FormItem>

                    {/* Descrição */}
                    <FormItem label="Descrição" invalid={Boolean(errors.descricao)} errorMessage={errors.descricao?.message}>
                        <Controller
                            name="descricao"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    rows={3}
                                    placeholder="Descreva o evento, o que levar, nível de habilidade..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    {/* RN05 aviso para mutirão */}
                    {tipo === 'mutirao' && (
                        <FormItem invalid={Boolean(errors.aceitaRN05)} errorMessage={errors.aceitaRN05?.message}>
                            <div className="p-3 bg-purple-50 rounded-xl mb-2">
                                <div className="flex items-start gap-2">
                                    <HiOutlineInformationCircle className="text-purple-500 text-lg shrink-0 mt-0.5" />
                                    <p className="text-xs text-purple-700">
                                        A MapPlay facilita a organização do mutirão, mas{' '}
                                        <strong>não se responsabiliza</strong> pela execução da
                                        revitalização. A ação ocorre por iniciativa própria dos
                                        participantes.
                                    </p>
                                </div>
                            </div>
                            <Controller
                                name="aceitaRN05"
                                control={control}
                                render={({ field }) => (
                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!!field.value}
                                            onChange={field.onChange}
                                            className="mt-0.5 w-4 h-4 accent-purple-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Entendi e aceito a responsabilidade por organizar este mutirão
                                        </span>
                                    </label>
                                )}
                            />
                        </FormItem>
                    )}

                    <Button block variant="solid" type="submit" loading={isSubmitting} className="mt-2 mb-6">
                        {isSubmitting ? 'Criando...' : 'Criar evento'}
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default EventCreate
