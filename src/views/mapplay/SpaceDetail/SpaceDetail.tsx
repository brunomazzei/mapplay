import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
    HiArrowLeft,
    HiOutlineMapPin,
    HiOutlineLightBulb,
    HiOutlineCheckBadge,
    HiOutlineClock,
    HiOutlineCalendarDays,
    HiOutlinePlusCircle,
} from 'react-icons/hi2'
import classNames from 'classnames'
import { useEspacoStore } from '@/store/espacoStore'
import { useEventoStore } from '@/store/eventoStore'
import EvaluationBar from './components/EvaluationBar'
import AvaliacaoSheet from './components/AvaliacaoSheet'
import ForumSection from './components/ForumSection'
import { formatEventDate } from '@/utils/formatDate'
import type { AvaliacaoConservacao } from '@/types/espaco'

const SPORT_CONFIG = {
    basquete: {
        emoji: '🏀',
        label: 'Basquete',
        gradient: 'from-orange-400 to-orange-600',
        atributoLabel: 'Altura da cesta',
        atributoMap: {
            regulamentar: 'Regulamentar (3,05m)',
            baixa: 'Baixa (adaptada)',
            adaptada: 'Adaptada / Improvisada',
        },
    },
    futebol: {
        emoji: '⚽',
        label: 'Futebol',
        gradient: 'from-green-500 to-green-700',
        atributoLabel: 'Tipo de gramado',
        atributoMap: {
            natural: 'Grama natural',
            sintetico: 'Grama sintética',
            areia: 'Areia',
            cimento: 'Cimento / Asfalto',
        },
    },
    skate: {
        emoji: '🛹',
        label: 'Skate',
        gradient: 'from-gray-500 to-gray-700',
        atributoLabel: 'Tipo de obstáculo',
        atributoMap: {
            bowl: 'Bowl',
            half_pipe: 'Half-pipe',
            street: 'Street / Corrimão',
            flatground: 'Flatground / Piso liso',
        },
    },
} as const

const Section = ({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) => (
    <div className="px-4 py-4 border-b border-gray-100">
        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {title}
        </h5>
        {children}
    </div>
)

const SpaceDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { espacos, avaliacoes, addAvaliacao, confirmarEspaco } = useEspacoStore()
    const eventosDoEspaco = useEventoStore((s) =>
        s.eventos.filter((e) => e.espacoId === id),
    )
    const [avaliacaoOpen, setAvaliacaoOpen] = useState(false)
    const [confirmFeedback, setConfirmFeedback] = useState<string | null>(null)

    const espaco = espacos.find((e) => e.id === id)
    const espacoAvaliacoes = avaliacoes.filter((a) => a.espacoId === id)

    if (!espaco) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400 px-6 text-center">
                <span className="text-5xl">🗺️</span>
                <p>Espaço não encontrado.</p>
                <button
                    onClick={() => navigate('/mapa')}
                    className="text-primary font-semibold text-sm"
                >
                    Voltar ao mapa
                </button>
            </div>
        )
    }

    const cfg = SPORT_CONFIG[espaco.modalidade]

    const atributoValor = (() => {
        if (!espaco.atributos) return null
        const a = espaco.atributos as Record<string, string>
        const val = Object.values(a)[0]
        return cfg.atributoMap[val as keyof typeof cfg.atributoMap] ?? val
    })()

    const handleAvaliacao = (nivel: AvaliacaoConservacao) => {
        addAvaliacao({ espacoId: espaco.id, nivel })
    }

    const handleConfirmar = () => {
        const resultado = confirmarEspaco(espaco.id)
        const msgs: Record<string, string> = {
            confirmado: `✅ Confirmação registrada! ${espaco.confirmacoes + 1}/3 confirmações.`,
            validado: '🎉 Parabéns! Suas confirmações validaram este espaço.',
            ja_validado: 'Este espaço já foi validado pela comunidade.',
        }
        setConfirmFeedback(msgs[resultado])
        setTimeout(() => setConfirmFeedback(null), 3500)
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {/* Hero com gradiente por esporte */}
                <div
                    className={classNames(
                        'relative flex items-center justify-center bg-gradient-to-br h-52',
                        cfg.gradient,
                    )}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 p-2 bg-black/20 rounded-full text-white"
                    >
                        <HiArrowLeft className="text-xl" />
                    </button>
                    <span className="text-8xl drop-shadow-lg">{cfg.emoji}</span>
                </div>

                {/* Nome e status */}
                <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900 flex-1">
                            {espaco.nome}
                        </h3>
                        <span
                            className={classNames(
                                'shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold',
                                espaco.status === 'validado'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700',
                            )}
                        >
                            {espaco.status === 'validado'
                                ? '✓ Validado'
                                : `⏳ ${espaco.confirmacoes}/3`}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500">
                        <span className="text-sm">{cfg.emoji}</span>
                        <span>{cfg.label}</span>
                    </div>
                </div>

                {/* Localização */}
                <Section title="Localização">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                        <HiOutlineMapPin className="text-primary text-lg shrink-0 mt-0.5" />
                        <div>
                            {espaco.endereco && (
                                <p className="font-medium">{espaco.endereco}</p>
                            )}
                            {(espaco.bairro || espaco.cidade) && (
                                <p className="text-gray-500">
                                    {[espaco.bairro, espaco.cidade]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                                {espaco.lat.toFixed(5)}, {espaco.lng.toFixed(5)}
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Características */}
                <Section title="Características">
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-sm">
                            <HiOutlineLightBulb className="text-yellow-500 text-lg" />
                            <span className="text-gray-700">
                                {espaco.iluminacao
                                    ? 'Com iluminação noturna'
                                    : 'Sem iluminação noturna'}
                            </span>
                        </div>
                        {atributoValor && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-lg">{cfg.emoji}</span>
                                <div>
                                    <span className="text-gray-500 text-xs">
                                        {cfg.atributoLabel}:{' '}
                                    </span>
                                    <span className="font-medium text-gray-800">
                                        {atributoValor}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                            <HiOutlineClock className="text-gray-400 text-lg" />
                            <span className="text-gray-500">
                                Cadastrado em {espaco.criadoEm}
                            </span>
                        </div>
                    </div>
                </Section>

                {/* Estado de conservação */}
                <Section title="Estado de conservação">
                    <EvaluationBar avaliacoes={espacoAvaliacoes} />
                    <button
                        onClick={() => setAvaliacaoOpen(true)}
                        className="mt-4 w-full py-2.5 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                    >
                        Avaliar conservação
                    </button>
                </Section>

                {/* Confirmação (apenas para espaços pendentes) */}
                {espaco.status === 'pendente' && (
                    <Section title="Validação pela comunidade">
                        <p className="text-sm text-gray-600 mb-3">
                            Este espaço ainda precisa de{' '}
                            <strong>
                                {3 - espaco.confirmacoes} confirmação
                                {3 - espaco.confirmacoes !== 1 ? 'ões' : ''}
                            </strong>{' '}
                            para ser validado no mapa.
                        </p>
                        {/* Progress dots */}
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3].map((n) => (
                                <div
                                    key={n}
                                    className={classNames(
                                        'flex-1 h-2 rounded-full transition-colors',
                                        n <= espaco.confirmacoes
                                            ? 'bg-primary'
                                            : 'bg-gray-200',
                                    )}
                                />
                            ))}
                        </div>
                        {confirmFeedback ? (
                            <div className="p-3 bg-green-50 rounded-xl text-sm text-green-700 text-center font-medium">
                                {confirmFeedback}
                            </div>
                        ) : (
                            <button
                                onClick={handleConfirmar}
                                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <HiOutlineCheckBadge className="text-lg" />
                                Confirmar que este espaço existe
                            </button>
                        )}
                    </Section>
                )}

                {/* Eventos */}
                <Section title="Eventos">
                    {eventosDoEspaco.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400 py-1">
                            <HiOutlineCalendarDays className="text-lg" />
                            <span>Nenhum evento agendado ainda.</span>
                        </div>
                    ) : (
                        <div className="space-y-2 mb-3">
                            {eventosDoEspaco.map((ev) => (
                                <button
                                    key={ev.id}
                                    onClick={() => navigate(`/evento/${ev.id}`)}
                                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-xl">
                                        {ev.tipo === 'mutirao' ? '🤝' : ev.modalidade === 'basquete' ? '🏀' : ev.modalidade === 'futebol' ? '⚽' : '🛹'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{ev.nome}</p>
                                        <p className="text-xs text-gray-500">{formatEventDate(ev.data, ev.hora)} · {ev.vagasRestantes}/{ev.vagas} vagas</p>
                                    </div>
                                    <span className="text-xs text-primary shrink-0">Ver →</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => navigate(`/eventos/novo?espacoId=${espaco.id}`)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-primary text-primary text-sm font-medium"
                    >
                        <HiOutlinePlusCircle className="text-lg" />
                        Criar evento neste espaço
                    </button>
                </Section>

                {/* Fórum da comunidade */}
                <Section title="Fórum da comunidade">
                    <ForumSection espacoId={espaco.id} />
                </Section>
            </div>

            {/* Sheet de avaliação */}
            <AvaliacaoSheet
                open={avaliacaoOpen}
                onClose={() => setAvaliacaoOpen(false)}
                onSubmit={handleAvaliacao}
            />
        </div>
    )
}

export default SpaceDetail
