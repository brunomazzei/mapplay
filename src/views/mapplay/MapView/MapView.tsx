import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router'
import { useEspacoStore } from '@/store/espacoStore'
import { useGeolocation } from '@/utils/hooks/useGeolocation'
import { createSpaceIcon, createUserIcon } from './utils/icons'
import classNames from 'classnames'
import { HiOutlineFunnel, HiPlus } from 'react-icons/hi2'
import type { Modalidade } from '@/types/espaco'

const SPORTS = [
    { key: 'todos', label: 'Todos', emoji: '🏅' },
    { key: 'basquete', label: 'Basquete', emoji: '🏀' },
    { key: 'futebol', label: 'Futebol', emoji: '⚽' },
    { key: 'skate', label: 'Skate', emoji: '🛹' },
] as const

const AVALIACAO_LABEL: Record<string, string> = {
    otimo: '✅ Ótimo',
    necessita_reparos: '⚠️ Necessita reparos',
    somente_revitalizacao: '🚫 Somente com revitalização',
}

/**
 * Centraliza o mapa na posição do usuário assim que ela chega.
 * Usa setView (imediato) em vez de flyTo (animado) para garantir
 * que funcione mesmo no primeiro mount da rota lazy-loaded.
 */
const MapCenterer = ({ position }: { position: [number, number] }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(position, 15)
        // Executa apenas uma vez: quando o componente monta com a posição real
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return null
}

const MapView = () => {
    const navigate = useNavigate()
    const { position, loading } = useGeolocation()
    const espacos = useEspacoStore((s) => s.espacos)
    const [activeSport, setActiveSport] = useState<string>('todos')
    const [showFilters, setShowFilters] = useState(false)
    const [filterIluminacao, setFilterIluminacao] = useState<boolean | null>(null)

    // Ponto inicial do mapa antes de ter GPS — São Paulo
    const SP_DEFAULT: [number, number] = [-23.5505, -46.6333]

    const filtered = espacos.filter((e) => {
        if (activeSport !== 'todos' && e.modalidade !== activeSport) return false
        if (filterIluminacao !== null && e.iluminacao !== filterIluminacao) return false
        return true
    })

    return (
        <div className="relative h-full w-full">
            {/* Chips de filtro por esporte */}
            <div className="absolute top-3 left-0 right-0 flex gap-2 z-[1000] px-3 overflow-x-auto no-scrollbar">
                {SPORTS.map((s) => (
                    <button
                        key={s.key}
                        onClick={() => setActiveSport(s.key)}
                        className={classNames(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-md transition-colors',
                            activeSport === s.key
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-700',
                        )}
                    >
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                    </button>
                ))}
                <button
                    onClick={() => setShowFilters((v) => !v)}
                    className={classNames(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-md transition-colors shrink-0',
                        showFilters || filterIluminacao !== null
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700',
                    )}
                >
                    <HiOutlineFunnel />
                    <span>Filtros</span>
                </button>
            </div>

            {/* Painel de filtros extras */}
            {showFilters && (
                <div className="absolute top-14 left-3 right-3 bg-white rounded-2xl shadow-xl z-[1000] p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Iluminação
                    </p>
                    <div className="flex gap-2">
                        {[
                            { label: 'Qualquer', value: null },
                            { label: 'Com luz', value: true },
                            { label: 'Sem luz', value: false },
                        ].map(({ label, value }) => (
                            <button
                                key={String(value)}
                                onClick={() => setFilterIluminacao(value)}
                                className={classNames(
                                    'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                                    filterIluminacao === value
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 text-gray-600',
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Mapa Leaflet */}
            <MapContainer
                center={SP_DEFAULT}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                />

                {/* Centraliza imediatamente na posição real do usuário */}
                {position && <MapCenterer position={position} />}

                {/* Marcador de posição do usuário (bolinha azul) */}
                {position && (
                    <Marker position={position} icon={createUserIcon()}>
                        <Popup>
                            <div className="text-center text-sm font-semibold">
                                Você está aqui
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Marcadores dos espaços */}
                {filtered.map((espaco) => (
                    <Marker
                        key={espaco.id}
                        position={[espaco.lat, espaco.lng]}
                        icon={createSpaceIcon(espaco.modalidade as Modalidade, espaco.status)}
                    >
                        <Popup minWidth={200}>
                            <div className="py-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-base">
                                        {espaco.modalidade === 'basquete' ? '🏀' : espaco.modalidade === 'futebol' ? '⚽' : '🛹'}
                                    </span>
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {espaco.nome}
                                    </span>
                                </div>
                                {espaco.bairro && (
                                    <p className="text-xs text-gray-500 mb-1">
                                        📍 {espaco.bairro}, {espaco.cidade}
                                    </p>
                                )}
                                <span
                                    className={classNames(
                                        'text-xs px-2 py-0.5 rounded-full font-medium',
                                        espaco.status === 'validado'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-orange-100 text-orange-700',
                                    )}
                                >
                                    {espaco.status === 'validado'
                                        ? '✓ Validado'
                                        : `⏳ ${espaco.confirmacoes}/3 confirmações`}
                                </span>
                                {espaco.avaliacao && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {AVALIACAO_LABEL[espaco.avaliacao]}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                    💡 {espaco.iluminacao ? 'Com iluminação' : 'Sem iluminação'}
                                </p>
                                <button
                                    className="mt-2 w-full text-xs text-primary font-semibold text-center py-1 rounded-lg bg-primary/10"
                                    onClick={() => navigate(`/espacos/${espaco.id}`)}
                                >
                                    Ver detalhes →
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay de carregamento do GPS */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-[1000]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-600">Obtendo localização...</p>
                    </div>
                </div>
            )}

            {/* FAB — Cadastrar espaço */}
            <button
                onClick={() => navigate('/espacos/novo')}
                className="absolute bottom-6 right-4 z-[1000] bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl"
            >
                <HiPlus className="text-2xl" />
            </button>

            {/* Legenda */}
            <div className="absolute bottom-6 left-3 z-[1000] bg-white rounded-xl shadow px-3 py-2 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-green-600 inline-block" />
                    Validado
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                    Pendente
                </div>
            </div>
        </div>
    )
}

export default MapView
