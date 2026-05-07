import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockPosts } from '@/mock/data/posts'
import type { PostForum, TipoPost } from '@/types/forum'

const USUARIO_MOCK = 'usuario-atual'
const USUARIO_NOME_MOCK = 'Você'

interface ForumState {
    posts: PostForum[]
    seguindoEspacos: string[]
    setFromParse: (posts: PostForum[]) => void
    addPost: (dados: { espacoId: string; conteudo: string; tipo: TipoPost }) => void
    curtir: (postId: string) => void
    seguirEspaco: (espacoId: string) => void
    deixarSeguirEspaco: (espacoId: string) => void
    reset: () => void
}

export const useForumStore = create<ForumState>()(
    persist(
        (set, get) => ({
            posts: mockPosts,
            seguindoEspacos: [],

            setFromParse: (posts) => set({ posts }),

            addPost: ({ espacoId, conteudo, tipo }) => {
                const novoPost: PostForum = {
                    id: `p${Date.now()}`,
                    espacoId,
                    conteudo,
                    autorId: USUARIO_MOCK,
                    autorNome: USUARIO_NOME_MOCK,
                    tipo,
                    curtidas: [],
                    criadoEm: new Date().toISOString(),
                }
                set((s) => ({ posts: [...s.posts, novoPost] }))
            },

            curtir: (postId) => {
                set((s) => ({
                    posts: s.posts.map((p) => {
                        if (p.id !== postId) return p
                        const jaCurtiu = p.curtidas.includes(USUARIO_MOCK)
                        return {
                            ...p,
                            curtidas: jaCurtiu
                                ? p.curtidas.filter((id) => id !== USUARIO_MOCK)
                                : [...p.curtidas, USUARIO_MOCK],
                        }
                    }),
                }))
            },

            seguirEspaco: (espacoId) => {
                const { seguindoEspacos } = get()
                if (!seguindoEspacos.includes(espacoId)) {
                    set({ seguindoEspacos: [...seguindoEspacos, espacoId] })
                }
            },

            deixarSeguirEspaco: (espacoId) => {
                set((s) => ({
                    seguindoEspacos: s.seguindoEspacos.filter((id) => id !== espacoId),
                }))
            },

            reset: () => set({ posts: mockPosts, seguindoEspacos: [] }),
        }),
        { name: 'mapplay-forum' },
    ),
)

export const USUARIO_ATUAL_FORUM = USUARIO_MOCK
