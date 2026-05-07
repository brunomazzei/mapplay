import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { HiArrowLeft, HiOutlineInformationCircle } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useGeolocation } from '@/utils/hooks/useGeolocation'
import { useEspacoStore } from '@/store/espacoStore'
import { createUserIcon } from '@/views/mapplay/MapView/utils/icons'
import classNames from 'classnames'
import type { Modalidade } from '@/types/espaco'

const MODALIDADES = [
    { key: 'basquete', label: 'Basquete', emoji: '🏀' },
    { key: 'futebol', label: 'Futebol', emoji: '⚽' },
    { key: 'skate', label: 'Skate', emoji: '🛹' },
] as const

const ATRIBUTOS = {
    basquete: {
        label: 'Altura da cesta',
        campo: 'alturaCesta',
        opcoes: [
            { value: 'regulamentar', label: 'Regulamentar (3,05m)' },
            { value: 'baixa', label: 'Baixa (adaptada crianças)' },
            { value: 'adaptada', label: 'Adaptada / Improvisada' },
        ],
    },
    futebol: {
        label: 'Tipo de gramado',
        campo: 'tipoGramado',
        opcoes: [
            { value: 'natural', label: 'Grama natural' },
            { value: 'sintetico', label: 'Grama sintética' },
            { value: 'areia', label: 'Areia' },
            { value: 'cimento', label: 'Cimento / Asfalto' },
        ],
    },
    skate: {
        label: 'Tipo de obstáculo',
        campo: 'tipoObstaculo',
        opcoes: [
            { value: 'bowl', label: 'Bowl' },
            { value: 'half_pipe', label: 'Half-pipe' },
            { value: 'street', label: 'Street / Corrimão' },
            { value: 'flatground', label: 'Flatground / Piso liso' },
        ],
    },
}

const schema = z.object({
    nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    isPublico: z.boolean().refine((v) => v, {
        message: 'Confirme que é um espaço público',
    }),
    modalidade: z.enum(['basquete', 'futebol', 'skate'], {
        required_error: 'Selecione uma modalidade',
    }),
    atributoValor: z.string().min(1, 'Selecione o atributo da modalidade'),
    iluminacao: z.boolean(),
    lat: z.number(),
    lng: z.number(),
})

type FormSchema = z.infer<typeof schema>

const LocationPicker = ({
    position,
    onChange,
}: {
    position: [number, number]
    onChange: (pos: [number, number]) => void
}) => {
    useMapEvents({
        click(e) {
            onChange([e.latlng.lat, e.latlng.lng])
        },
    })
    return <Marker position={position} icon={createUserIcon()} />
}

const SpaceRegister = () => {
    const navigate = useNavigate()
    const { position } = useGeolocation()
    const addRegistro = useEspacoStore((s) => s.addRegistro)
    const [isSubmitting, setSubmitting] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [markerPos, setMarkerPos] = useState<[number, number] | null>(null)

    const mapCenter = position ?? [-23.5505, -46.6333]

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            isPublico: false,
            iluminacao: false,
            lat: mapCenter[0],
            lng: mapCenter[1],
            atributoValor: '',
        },
    })

    const modalidade = watch('modalidade')
    const atributoConfig = modalidade ? ATRIBUTOS[modalidade] : null

    const handleLocationChange = (pos: [number, number]) => {
        setMarkerPos(pos)
        setValue('lat', pos[0])
        setValue('lng', pos[1])
    }

    const currentMarker = markerPos ?? mapCenter

    const onSubmit = async (data: FormSchema) => {
        setSubmitting(true)
        await new Promise((r) => setTimeout(r, 600))

        const atributos =
            modalidade === 'basquete'
                ? { alturaCesta: data.atributoValor as 'regulamentar' | 'baixa' | 'adaptada' }
                : modalidade === 'futebol'
                  ? { tipoGramado: data.atributoValor as 'natural' | 'sintetico' | 'areia' | 'cimento' }
                  : { tipoObstaculo: data.atributoValor as 'bowl' | 'half_pipe' | 'street' | 'flatground' }

        const resultado = addRegistro({
            nome: data.nome,
            modalidade: data.modalidade as Modalidade,
            lat: data.lat,
            lng: data.lng,
            iluminacao: data.iluminacao,
            atributos,
        })

        const msgs = {
            novo: '📍 Espaço registrado! Aguardando 2 confirmações para ser validado.',
            confirmado: '✅ Você confirmou este espaço! Falta mais 1 confirmação.',
            validado: '🎉 Espaço validado! Ele já aparece no mapa para todos.',
        }

        setSuccessMsg(msgs[resultado])
        setSubmitting(false)
    }

    if (successMsg) {
        return (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center gap-4 bg-white">
                <div className="text-6xl">🗺️</div>
                <h3 className="font-bold text-gray-900">{successMsg}</h3>
                <p className="text-sm text-gray-500">
                    O consenso democrático garante que apenas locais reais sejam
                    mapeados.
                </p>
                <Button variant="solid" onClick={() => navigate('/mapa')}>
                    Ver no mapa
                </Button>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <HiArrowLeft className="text-xl text-gray-700" />
                </button>
                <div>
                    <h4 className="font-bold text-gray-900">Cadastrar espaço</h4>
                    <p className="text-xs text-gray-500">
                        Apenas espaços públicos
                    </p>
                </div>
            </div>

            {/* Mini-map */}
            <div className="h-44 shrink-0 relative">
                <MapContainer
                    center={mapCenter}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker
                        position={currentMarker as [number, number]}
                        onChange={handleLocationChange}
                    />
                </MapContainer>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center z-[1000]">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        Toque no mapa para ajustar o pin
                    </span>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* GPS coords */}
                    <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-xl">
                        <HiOutlineInformationCircle className="text-blue-500 text-lg shrink-0" />
                        <p className="text-xs text-blue-700">
                            Coordenadas: {currentMarker[0].toFixed(5)},{' '}
                            {currentMarker[1].toFixed(5)}
                        </p>
                    </div>

                    {/* Nome */}
                    <FormItem
                        label="Nome do espaço"
                        invalid={Boolean(errors.nome)}
                        errorMessage={errors.nome?.message}
                    >
                        <Controller
                            name="nome"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Ex: Quadra da Praça Central"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    {/* Confirmação espaço público (RN02) */}
                    <FormItem
                        invalid={Boolean(errors.isPublico)}
                        errorMessage={errors.isPublico?.message}
                    >
                        <Controller
                            name="isPublico"
                            control={control}
                            render={({ field }) => (
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="mt-0.5 w-4 h-4 accent-primary"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Confirmo que este é um{' '}
                                        <strong>espaço público</strong> (praça,
                                        centro comunitário, etc.)
                                    </span>
                                </label>
                            )}
                        />
                    </FormItem>

                    {/* Modalidade (RN04) */}
                    <FormItem
                        label="Modalidade esportiva"
                        invalid={Boolean(errors.modalidade)}
                        errorMessage={errors.modalidade?.message}
                    >
                        <div className="flex gap-2">
                            {MODALIDADES.map((m) => (
                                <Controller
                                    key={m.key}
                                    name="modalidade"
                                    control={control}
                                    render={({ field }) => (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                field.onChange(m.key)
                                                setValue('atributoValor', '')
                                            }}
                                            className={classNames(
                                                'flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors',
                                                field.value === m.key
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 text-gray-500',
                                            )}
                                        >
                                            <span className="text-2xl">
                                                {m.emoji}
                                            </span>
                                            <span>{m.label}</span>
                                        </button>
                                    )}
                                />
                            ))}
                        </div>
                    </FormItem>

                    {/* Atributo específico por modalidade (RN04) */}
                    {atributoConfig && (
                        <FormItem
                            label={atributoConfig.label}
                            invalid={Boolean(errors.atributoValor)}
                            errorMessage={errors.atributoValor?.message}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {atributoConfig.opcoes.map((op) => (
                                    <Controller
                                        key={op.value}
                                        name="atributoValor"
                                        control={control}
                                        render={({ field }) => (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    field.onChange(op.value)
                                                }
                                                className={classNames(
                                                    'py-2 px-3 rounded-xl border-2 text-sm font-medium text-left transition-colors',
                                                    field.value === op.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 text-gray-600',
                                                )}
                                            >
                                                {op.label}
                                            </button>
                                        )}
                                    />
                                ))}
                            </div>
                        </FormItem>
                    )}

                    {/* Iluminação */}
                    <FormItem label="Iluminação noturna">
                        <Controller
                            name="iluminacao"
                            control={control}
                            render={({ field }) => (
                                <div className="flex gap-2">
                                    {[
                                        { label: '💡 Com iluminação', value: true },
                                        { label: '🌑 Sem iluminação', value: false },
                                    ].map(({ label, value }) => (
                                        <button
                                            key={String(value)}
                                            type="button"
                                            onClick={() =>
                                                field.onChange(value)
                                            }
                                            className={classNames(
                                                'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-colors',
                                                field.value === value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 text-gray-600',
                                            )}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </FormItem>

                    <Button
                        block
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                        className="mt-2 mb-6"
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrar espaço'}
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default SpaceRegister
