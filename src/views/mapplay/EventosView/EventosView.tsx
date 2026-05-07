import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HiPlus } from 'react-icons/hi2'
import classNames from 'classnames'
import { useEventoStore } from '@/store/eventoStore'
import EventCard from './components/EventCard'
import type { TipoEvento } from '@/types/evento'

type Filtro = 'todos' | TipoEvento

const FILTROS: { key: Filtro; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'esportivo', label: '🏃 Esportivos' },
    { key: 'mutirao', label: '🤝 Mutirões' },
]

const EventosView = () => {
    const navigate = useNavigate()
    const eventos = useEventoStore((s) => s.eventos)
    const [filtro, setFiltro] = useState<Filtro>('todos')

    const filtrados = eventos
        .filter((e) => filtro === 'todos' || e.tipo === filtro)
        .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 shrink-0">
                <h3 className="font-bold text-gray-900 mb-3">Eventos</h3>
                <div className="flex gap-2">
                    {FILTROS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFiltro(f.key)}
                            className={classNames(
                                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                                filtro === f.key
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600',
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {filtrados.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
                        <span className="text-4xl">📅</span>
                        <p className="text-gray-500 text-sm">
                            Nenhum evento encontrado.
                        </p>
                        <button
                            onClick={() => navigate('/eventos/novo')}
                            className="text-primary text-sm font-semibold"
                        >
                            Criar o primeiro evento
                        </button>
                    </div>
                ) : (
                    filtrados.map((evento) => (
                        <EventCard key={evento.id} evento={evento} />
                    ))
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => navigate('/eventos/novo')}
                className="absolute bottom-20 right-4 z-10 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl"
            >
                <HiPlus className="text-2xl" />
            </button>
        </div>
    )
}

export default EventosView
