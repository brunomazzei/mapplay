import { useState, useRef, useEffect } from 'react'
import {
    HiOutlineHeart,
    HiHeart,
    HiOutlinePaperAirplane,
    HiOutlineInformationCircle,
    HiBellAlert,
    HiBell,
} from 'react-icons/hi2'
import classNames from 'classnames'
import { useForumStore, USUARIO_ATUAL_FORUM } from '@/store/forumStore'
import { relativeTime } from '@/utils/relativeTime'
import type { TipoPost } from '@/types/forum'

const AVATAR_COLORS = [
    'bg-blue-500', 'bg-green-600', 'bg-purple-500',
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-red-500',
]

const colorForId = (id: string) =>
    AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length]

const initials = (nome: string) =>
    nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

interface ForumSectionProps {
    espacoId: string
}

const ForumSection = ({ espacoId }: ForumSectionProps) => {
    const { posts, addPost, curtir, seguindoEspacos, seguirEspaco, deixarSeguirEspaco } =
        useForumStore()
    const [conteudo, setConteudo] = useState('')
    const [tipo, setTipo] = useState<TipoPost>('discussao')
    const [sending, setSending] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const postsDoEspaco = posts
        .filter((p) => p.espacoId === espacoId)
        .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))

    const seguindo = seguindoEspacos.includes(espacoId)

    const handleSend = async () => {
        if (!conteudo.trim()) return
        setSending(true)
        await new Promise((r) => setTimeout(r, 300))
        addPost({ espacoId, conteudo: conteudo.trim(), tipo })
        setConteudo('')
        setTipo('discussao')
        setSending(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div>
            {/* Seguir espaço */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500">
                    {postsDoEspaco.length} publicação{postsDoEspaco.length !== 1 ? 'ões' : ''}
                </p>
                <button
                    onClick={() =>
                        seguindo
                            ? deixarSeguirEspaco(espacoId)
                            : seguirEspaco(espacoId)
                    }
                    className={classNames(
                        'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors',
                        seguindo
                            ? 'bg-primary text-white'
                            : 'border border-primary text-primary',
                    )}
                >
                    {seguindo ? (
                        <><HiBellAlert className="text-sm" /> Seguindo</>
                    ) : (
                        <><HiBell className="text-sm" /> Seguir espaço</>
                    )}
                </button>
            </div>

            {/* RN05 disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl mb-3">
                <HiOutlineInformationCircle className="text-purple-500 text-base shrink-0 mt-0.5" />
                <p className="text-xs text-purple-700">
                    Este fórum é para organização comunitária. A MapPlay{' '}
                    <strong>não se responsabiliza</strong> pela manutenção dos
                    espaços — as ações dependem da iniciativa dos participantes.
                </p>
            </div>

            {/* Lista de posts */}
            {postsDoEspaco.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                    Nenhuma publicação ainda. Seja o primeiro a escrever!
                </p>
            ) : (
                <div className="space-y-3 mb-4">
                    {postsDoEspaco.map((post) => {
                        const jaCurtiu = post.curtidas.includes(USUARIO_ATUAL_FORUM)
                        return (
                            <div key={post.id} className="bg-gray-50 rounded-2xl p-3">
                                {/* Autor + tempo */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className={classNames(
                                            'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                                            colorForId(post.autorId),
                                        )}
                                    >
                                        {initials(post.autorNome)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                            {post.autorNome}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {relativeTime(post.criadoEm)}
                                        </p>
                                    </div>
                                    {post.tipo === 'mobilizacao' && (
                                        <span className="shrink-0 text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                            📢 Mobilização
                                        </span>
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <p className="text-sm text-gray-800 leading-relaxed mb-2">
                                    {post.conteudo}
                                </p>

                                {/* Curtir */}
                                <button
                                    onClick={() => curtir(post.id)}
                                    className="flex items-center gap-1 text-xs font-medium transition-colors"
                                >
                                    {jaCurtiu ? (
                                        <HiHeart className="text-red-500 text-base" />
                                    ) : (
                                        <HiOutlineHeart className="text-gray-400 text-base" />
                                    )}
                                    <span className={jaCurtiu ? 'text-red-500' : 'text-gray-400'}>
                                        {post.curtidas.length}
                                    </span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Input nova publicação */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
                {/* Tipo toggle */}
                <div className="flex border-b border-gray-100">
                    {([
                        { key: 'discussao', label: '💬 Discussão' },
                        { key: 'mobilizacao', label: '📢 Mobilização' },
                    ] as { key: TipoPost; label: string }[]).map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTipo(t.key)}
                            className={classNames(
                                'flex-1 py-2 text-xs font-semibold transition-colors',
                                tipo === t.key
                                    ? t.key === 'mobilizacao'
                                        ? 'bg-purple-50 text-purple-700'
                                        : 'bg-primary/10 text-primary'
                                    : 'text-gray-400 hover:text-gray-600',
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-end gap-2 p-3">
                    <textarea
                        ref={inputRef}
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            tipo === 'mobilizacao'
                                ? 'Chame a comunidade para uma ação...'
                                : 'Escreva uma mensagem...'
                        }
                        rows={2}
                        className="flex-1 text-sm resize-none outline-none bg-transparent text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!conteudo.trim() || sending}
                        className={classNames(
                            'shrink-0 p-2 rounded-full transition-colors',
                            conteudo.trim()
                                ? tipo === 'mobilizacao'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-400',
                        )}
                    >
                        <HiOutlinePaperAirplane className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForumSection
