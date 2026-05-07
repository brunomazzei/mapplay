import { useEffect } from 'react'
import appConfig from '@/configs/app.config'
import { useEspacoStore } from '@/store/espacoStore'
import { useEventoStore } from '@/store/eventoStore'
import { useForumStore } from '@/store/forumStore'
import { buscarEspacos, buscarAvaliacoes } from '@/services/parse/espacoService'
import { buscarEventos } from '@/services/parse/eventoService'
import { buscarPosts } from '@/services/parse/forumService'
import { subscribeToEspacos } from '@/services/parse/liveQueryService'
import type { ReactNode } from 'react'

interface DataLoaderProps {
    children: ReactNode
}

/**
 * Quando enableMock: false, carrega dados reais do Back4App
 * e mantém o mapa sincronizado via LiveQuery.
 * Quando enableMock: true, as stores já têm os dados mock.
 */
const DataLoader = ({ children }: DataLoaderProps) => {
    const setEspacos = useEspacoStore((s) => s.setFromParse)
    const setEventos = useEventoStore((s) => s.setFromParse)
    const setPosts = useForumStore((s) => s.setFromParse)

    useEffect(() => {
        if (appConfig.enableMock) return

        let unsubscribeLQ: (() => void) | null = null

        const init = async () => {
            try {
                // Carga inicial paralela
                const [espacos, avaliacoes, eventos, posts] = await Promise.all([
                    buscarEspacos(),
                    buscarAvaliacoes(),
                    buscarEventos(),
                    buscarPosts(),
                ])

                setEspacos(espacos, avaliacoes)
                setEventos(eventos)
                setPosts(posts)

                // LiveQuery: atualiza o mapa em tempo real
                unsubscribeLQ = await subscribeToEspacos(
                    (novoEspaco) => {
                        useEspacoStore.setState((s) => ({
                            espacos: [
                                ...s.espacos.filter((e) => e.id !== novoEspaco.id),
                                novoEspaco,
                            ],
                        }))
                    },
                    (atualizado) => {
                        useEspacoStore.setState((s) => ({
                            espacos: s.espacos.map((e) =>
                                e.id === atualizado.id ? atualizado : e,
                            ),
                        }))
                    },
                    (deletadoId) => {
                        useEspacoStore.setState((s) => ({
                            espacos: s.espacos.filter((e) => e.id !== deletadoId),
                        }))
                    },
                )
            } catch (err) {
                console.error('[DataLoader] Erro ao carregar dados do Back4App:', err)
            }
        }

        init()
        return () => { unsubscribeLQ?.() }
    }, [setEspacos, setEventos, setPosts])

    return <>{children}</>
}

export default DataLoader
