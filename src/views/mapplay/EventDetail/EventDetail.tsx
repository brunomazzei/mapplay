import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
    HiArrowLeft,
    HiOutlineCalendarDays,
    HiOutlineMapPin,
    HiOutlineUsers,
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
} from 'react-icons/hi2'
import classNames from 'classnames'
import { useEventoStore, USUARIO_ATUAL } from '@/store/eventoStore'
import { useEspacoStore } from '@/store/espacoStore'
import { formatEventDate } from '@/utils/formatDate'

const AVATAR_COLORS = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
]

const EventDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { eventos, participar, sair } = useEventoStore()
    const espacos = useEspacoStore((s) => s.espacos)
    const [feedback, setFeedback] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const evento = eventos.find((e) => e.id === id)
    const espaco = evento ? espacos.find((e) => e.id === evento.espacoId) : null

    if (!evento) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-400 px-6 text-center">
                <span className="text-5xl">📅</span>
                <p>Evento não encontrado.</p>
                <button onClick={() => navigate('/eventos')} className="text-primary font-semibold text-sm">
                    Ver eventos
                </button>
            </div>
        )
    }

    const isMutirao = evento.tipo === 'mutirao'
    const inscrito = evento.participantes.includes(USUARIO_ATUAL)
    const lotado = evento.vagasRestantes === 0 && !inscrito
    const pctOcupado = Math.round(((evento.vagas - evento.vagasRestantes) / evento.vagas) * 100)

    const handleParticipar = async () => {
        setLoading(true)
        await new Promise((r) => setTimeout(r, 400))
        const res = participar(evento.id)
        const msgs: Record<string, string> = {
            ok: isMutirao ? '✅ Presença confirmada no mutirão!' : '✅ Inscrição confirmada!',
            lotado: '😔 Evento lotado.',
            ja_inscrito: 'Você já está inscrito.',
        }
        setFeedback(msgs[res])
        setLoading(false)
    }

    const handleSair = async () => {
        setLoading(true)
        await new Promise((r) => setTimeout(r, 400))
        sair(evento.id)
        setFeedback('Inscrição cancelada.')
        setLoading(false)
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {/* Hero */}
                <div
                    className={classNames(
                        'relative flex items-center justify-center h-40 bg-gradient-to-br',
                        isMutirao ? 'from-purple-500 to-purple-700' : 'from-primary to-blue-600',
                    )}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 p-2 bg-black/20 rounded-full text-white"
                    >
                        <HiArrowLeft className="text-xl" />
                    </button>
                    <span className="text-7xl drop-shadow-lg">
                        {isMutirao ? '🤝' : evento.modalidade === 'basquete' ? '🏀' : evento.modalidade === 'futebol' ? '⚽' : '🛹'}
                    </span>
                </div>

                {/* Nome e badge */}
                <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
                    <div className="flex items-start gap-2 mb-1">
                        <span
                            className={classNames(
                                'shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full',
                                isMutirao ? 'bg-purple-100 text-purple-700' : 'bg-primary/10 text-primary',
                            )}
                        >
                            {isMutirao ? '🤝 Mutirão' : '🏃 Esportivo'}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{evento.nome}</h3>
                </div>

                {/* Info cards */}
                <div className="px-4 py-4 space-y-3">

                    {/* Data e hora */}
                    <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
                        <HiOutlineCalendarDays className="text-2xl text-primary shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatEventDate(evento.data, evento.hora)}
                            </p>
                            <p className="text-xs text-gray-500">Data e horário</p>
                        </div>
                    </div>

                    {/* Local */}
                    {espaco && (
                        <button
                            className="bg-white rounded-2xl p-4 flex items-center gap-3 w-full text-left"
                            onClick={() => navigate(`/espacos/${espaco.id}`)}
                        >
                            <HiOutlineMapPin className="text-2xl text-primary shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">{espaco.nome}</p>
                                {espaco.bairro && (
                                    <p className="text-xs text-gray-500">{espaco.bairro}, {espaco.cidade}</p>
                                )}
                            </div>
                            <span className="text-xs text-primary">Ver →</span>
                        </button>
                    )}

                    {/* Vagas */}
                    <div className="bg-white rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <HiOutlineUsers className="text-2xl text-primary shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {evento.vagas - evento.vagasRestantes} / {evento.vagas} participantes
                                </p>
                                <p className="text-xs text-gray-500">
                                    {evento.vagasRestantes > 0
                                        ? `${evento.vagasRestantes} vaga${evento.vagasRestantes !== 1 ? 's' : ''} disponível`
                                        : 'Evento lotado'}
                                </p>
                            </div>
                        </div>
                        {/* Occupancy bar */}
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div
                                className={classNames('h-full rounded-full', lotado && !inscrito ? 'bg-red-400' : pctOcupado > 70 ? 'bg-yellow-400' : 'bg-green-400')}
                                style={{ width: `${pctOcupado}%` }}
                            />
                        </div>
                        {/* Avatar stack */}
                        <div className="flex items-center gap-1">
                            {evento.participantes.slice(0, 8).map((uid, i) => (
                                <div
                                    key={uid}
                                    className={classNames(
                                        'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white -ml-1 first:ml-0',
                                        AVATAR_COLORS[i % AVATAR_COLORS.length],
                                    )}
                                >
                                    {uid === USUARIO_ATUAL ? '✓' : uid.slice(-1).toUpperCase()}
                                </div>
                            ))}
                            {evento.participantes.length > 8 && (
                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold border-2 border-white -ml-1">
                                    +{evento.participantes.length - 8}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="bg-white rounded-2xl p-4">
                        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Descrição</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{evento.descricao}</p>
                    </div>

                    {/* RN05 aviso para mutirão */}
                    {isMutirao && (
                        <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                            <HiOutlineInformationCircle className="text-purple-500 text-lg shrink-0 mt-0.5" />
                            <p className="text-xs text-purple-700">
                                Este mutirão é organizado por voluntários. A MapPlay facilita
                                o contato mas não se responsabiliza pela execução da
                                revitalização.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* CTA fixo no fundo */}
            <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3">
                {feedback && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 rounded-xl text-sm text-green-700">
                        <HiOutlineCheckCircle className="text-lg shrink-0" />
                        {feedback}
                    </div>
                )}
                {inscrito ? (
                    <button
                        onClick={handleSair}
                        disabled={loading}
                        className="w-full py-3 rounded-xl border-2 border-red-300 text-red-500 text-sm font-semibold"
                    >
                        {loading ? 'Cancelando...' : 'Cancelar inscrição'}
                    </button>
                ) : (
                    <button
                        onClick={handleParticipar}
                        disabled={lotado || loading}
                        className={classNames(
                            'w-full py-3 rounded-xl text-sm font-semibold text-white',
                            lotado
                                ? 'bg-gray-300 cursor-not-allowed'
                                : isMutirao
                                  ? 'bg-purple-600'
                                  : 'bg-primary',
                        )}
                    >
                        {loading ? 'Processando...' : lotado ? 'Evento lotado' : isMutirao ? '🤝 Confirmar presença no mutirão' : '🏃 Quero participar!'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default EventDetail
