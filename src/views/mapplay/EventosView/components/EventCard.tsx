import { useNavigate } from 'react-router'
import classNames from 'classnames'
import { HiOutlineCalendarDays, HiOutlineUsers } from 'react-icons/hi2'
import { formatEventDate } from '@/utils/formatDate'
import { useEspacoStore } from '@/store/espacoStore'
import type { Evento } from '@/types/evento'

const SPORT_EMOJI: Record<string, string> = {
    basquete: '🏀',
    futebol: '⚽',
    skate: '🛹',
}

interface EventCardProps {
    evento: Evento
}

const EventCard = ({ evento }: EventCardProps) => {
    const navigate = useNavigate()
    const espaco = useEspacoStore((s) =>
        s.espacos.find((e) => e.id === evento.espacoId),
    )

    const lotado = evento.vagasRestantes === 0
    const isMutirao = evento.tipo === 'mutirao'
    const pctOcupado = Math.round(
        ((evento.vagas - evento.vagasRestantes) / evento.vagas) * 100,
    )

    return (
        <button
            onClick={() => navigate(`/evento/${evento.id}`)}
            className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform"
        >
            {/* Type accent strip */}
            <div
                className={classNames(
                    'h-1 w-full',
                    isMutirao ? 'bg-purple-500' : 'bg-primary',
                )}
            />

            <div className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                                className={classNames(
                                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                                    isMutirao
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-primary/10 text-primary',
                                )}
                            >
                                {isMutirao ? '🤝 Mutirão' : '🏃 Esportivo'}
                            </span>
                            {evento.modalidade && (
                                <span className="text-sm">
                                    {SPORT_EMOJI[evento.modalidade]}
                                </span>
                            )}
                        </div>
                        <h5 className="font-bold text-gray-900 text-sm leading-snug">
                            {evento.nome}
                        </h5>
                    </div>
                    {lotado && (
                        <span className="shrink-0 text-xs font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                            Lotado
                        </span>
                    )}
                </div>

                {/* Espaço vinculado */}
                {espaco && (
                    <p className="text-xs text-gray-500 mb-2">
                        📍 {espaco.nome}
                        {espaco.bairro ? ` · ${espaco.bairro}` : ''}
                    </p>
                )}

                {/* Date + vagas */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <HiOutlineCalendarDays className="text-base" />
                        {formatEventDate(evento.data, evento.hora)}
                    </span>
                    <span className="flex items-center gap-1">
                        <HiOutlineUsers className="text-base" />
                        {evento.vagas - evento.vagasRestantes}/{evento.vagas}
                    </span>
                </div>

                {/* Occupancy bar */}
                <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={classNames(
                            'h-full rounded-full transition-all',
                            lotado
                                ? 'bg-red-400'
                                : pctOcupado > 70
                                  ? 'bg-yellow-400'
                                  : 'bg-green-400',
                        )}
                        style={{ width: `${pctOcupado}%` }}
                    />
                </div>
            </div>
        </button>
    )
}

export default EventCard
