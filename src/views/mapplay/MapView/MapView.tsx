import { useState } from 'react'
import classNames from 'classnames'

const sports = [
    { key: 'todos', label: 'Todos', emoji: '🏅' },
    { key: 'basquete', label: 'Basquete', emoji: '🏀' },
    { key: 'futebol', label: 'Futebol', emoji: '⚽' },
    { key: 'skate', label: 'Skate', emoji: '🛹' },
]

const MapView = () => {
    const [activeSport, setActiveSport] = useState('todos')

    return (
        <div className="relative h-full w-full bg-[#d6e8d6] flex items-center justify-center overflow-hidden">
            <div className="absolute top-4 left-0 right-0 flex gap-2 z-10 px-4 overflow-x-auto no-scrollbar">
                {sports.map((s) => (
                    <button
                        key={s.key}
                        onClick={() => setActiveSport(s.key)}
                        className={classNames(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow transition-colors',
                            activeSport === s.key
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700',
                        )}
                    >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>

            <p className="text-gray-500 text-sm">
                Mapa interativo — Fase 2
            </p>

            <button className="absolute bottom-6 right-4 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl leading-none">
                +
            </button>
        </div>
    )
}

export default MapView
