import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { HiOutlineMagnifyingGlass, HiOutlineMapPin, HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import classNames from 'classnames'
import { useEspacoStore } from '@/store/espacoStore'
import { useEventoStore } from '@/store/eventoStore'
import { useForumStore } from '@/store/forumStore'
import { relativeTime } from '@/utils/relativeTime'

const SPORT_EMOJI: Record<string, string> = { basquete: '🏀', futebol: '⚽', skate: '🛹' }

const AVALIACAO_BADGE: Record<string, { label: string; color: string }> = {
    necessita_reparos: { label: 'Necessita reparos', color: 'text-yellow-600 bg-yellow-50' },
    somente_revitalizacao: { label: 'Precisa de revitalização', color: 'text-red-600 bg-red-50' },
}

const ExplorarView = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')

    const espacos = useEspacoStore((s) => s.espacos)
    const eventos = useEventoStore((s) => s.eventos)
    const posts = useForumStore((s) => s.posts)

    const stats = useMemo(() => ({
        espacosValidados: espacos.filter((e) => e.status === 'validado').length,
        espacosPendentes: espacos.filter((e) => e.status === 'pendente').length,
        totalEventos: eventos.length,
        totalParticipantes: new Set(eventos.flatMap((e) => e.participantes)).size,
    }), [espacos, eventos])

    const resultadosBusca = useMemo(() => {
        if (query.trim().length < 2) return []
        const q = query.toLowerCase()
        return espacos.filter(
            (e) =>
                e.nome.toLowerCase().includes(q) ||
                e.bairro?.toLowerCase().includes(q) ||
                e.cidade?.toLowerCase().includes(q),
        )
    }, [query, espacos])

    const precisamAtencao = useMemo(() =>
        espacos.filter(
            (e) =>
                e.status === 'validado' &&
                (e.avaliacao === 'necessita_reparos' || e.avaliacao === 'somente_revitalizacao'),
        ),
    [espacos])

    const atividadeRecente = useMemo(() =>
        [...posts]
            .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
            .slice(0, 5),
    [posts])

    const buscando = query.trim().length >= 2

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 shrink-0">
                <h3 className="font-bold text-gray-900 mb-3">Explorar</h3>
                <div className="relative">
                    <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por nome, bairro ou cidade..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

                {/* Resultados de busca */}
                {buscando && (
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Resultados ({resultadosBusca.length})
                        </p>
                        {resultadosBusca.length === 0 ? (
                            <p className="text-sm text-gray-400 py-2">Nenhum espaço encontrado.</p>
                        ) : (
                            <div className="space-y-2">
                                {resultadosBusca.map((e) => (
                                    <button
                                        key={e.id}
                                        onClick={() => navigate(`/espacos/${e.id}`)}
                                        className="w-full flex items-center gap-3 bg-white rounded-xl p-3 text-left shadow-sm border border-gray-100"
                                    >
                                        <span className="text-2xl">{SPORT_EMOJI[e.modalidade]}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{e.nome}</p>
                                            {e.bairro && <p className="text-xs text-gray-500">{e.bairro}, {e.cidade}</p>}
                                        </div>
                                        <span className={classNames(
                                            'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                                            e.status === 'validado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700',
                                        )}>
                                            {e.status === 'validado' ? '✓' : `⏳ ${e.confirmacoes}/3`}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Stats */}
                {!buscando && (
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Espaços mapeados', value: stats.espacosValidados, emoji: '📍', color: 'bg-green-50 text-green-700' },
                            { label: 'Aguardando validação', value: stats.espacosPendentes, emoji: '⏳', color: 'bg-orange-50 text-orange-700' },
                            { label: 'Eventos criados', value: stats.totalEventos, emoji: '📅', color: 'bg-blue-50 text-blue-700' },
                            { label: 'Participantes', value: stats.totalParticipantes, emoji: '👥', color: 'bg-purple-50 text-purple-700' },
                        ].map((s) => (
                            <div key={s.label} className={classNames('rounded-2xl p-3', s.color)}>
                                <p className="text-2xl font-bold">{s.emoji} {s.value}</p>
                                <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Espaços que precisam de atenção */}
                {!buscando && precisamAtencao.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            🚨 Precisam de você
                        </p>
                        <div className="space-y-2">
                            {precisamAtencao.map((e) => {
                                const badge = e.avaliacao ? AVALIACAO_BADGE[e.avaliacao] : null
                                return (
                                    <button
                                        key={e.id}
                                        onClick={() => navigate(`/espacos/${e.id}`)}
                                        className="w-full flex items-center gap-3 bg-white rounded-2xl p-3 text-left shadow-sm border border-gray-100"
                                    >
                                        <span className="text-2xl">{SPORT_EMOJI[e.modalidade]}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{e.nome}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                <HiOutlineMapPin className="text-gray-400 text-xs shrink-0" />
                                                <p className="text-xs text-gray-500">{e.bairro}</p>
                                                {badge && (
                                                    <span className={classNames('text-xs px-1.5 py-0.5 rounded-full font-medium', badge.color)}>
                                                        {badge.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-primary shrink-0">Ver →</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Atividade recente do fórum */}
                {!buscando && (
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            💬 Atividade recente
                        </p>
                        {atividadeRecente.length === 0 ? (
                            <p className="text-sm text-gray-400">Nenhuma publicação ainda.</p>
                        ) : (
                            <div className="space-y-2">
                                {atividadeRecente.map((post) => {
                                    const espaco = espacos.find((e) => e.id === post.espacoId)
                                    return (
                                        <button
                                            key={post.id}
                                            onClick={() => navigate(`/espacos/${post.espacoId}`)}
                                            className="w-full bg-white rounded-2xl p-3 text-left shadow-sm border border-gray-100"
                                        >
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <HiOutlineChatBubbleLeftRight className={classNames(
                                                    'text-base shrink-0',
                                                    post.tipo === 'mobilizacao' ? 'text-purple-500' : 'text-primary',
                                                )} />
                                                <p className="text-xs text-gray-500 truncate flex-1">
                                                    <span className="font-semibold text-gray-700">{post.autorNome}</span>
                                                    {' '}em{' '}
                                                    <span className="font-semibold text-gray-700">{espaco?.nome ?? 'espaço'}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 shrink-0">{relativeTime(post.criadoEm)}</p>
                                            </div>
                                            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                                {post.conteudo}
                                            </p>
                                            {post.tipo === 'mobilizacao' && (
                                                <span className="mt-1.5 inline-block text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                                    📢 Mobilização
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default ExplorarView
