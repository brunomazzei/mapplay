import { useEffect, useCallback } from 'react'
import appConfig from '@/configs/app.config'
import { useEspacoStore } from '@/store/espacoStore'
import { useEventoStore } from '@/store/eventoStore'
import { useForumStore } from '@/store/forumStore'
import { buscarEspacos, buscarAvaliacoes } from '@/services/parse/espacoService'
import { buscarEventos } from '@/services/parse/eventoService'
import { buscarPosts } from '@/services/parse/forumService'
import type { ReactNode } from 'react'

// Polling a cada 30s — alternativa ao LiveQuery (que requer plano pago no Back4App)
const POLL_INTERVAL_MS = 30_000

interface DataLoaderProps {
    children: ReactNode
}

/**
 * Quando enableMock: false, carrega dados reais do Back4App na inicialização
 * e re-sincroniza o mapa por polling a cada 30 segundos.
 * Quando enableMock: true, as stores já têm os dados mock e nada é feito.
 */
const DataLoader = ({ children }: DataLoaderProps) => {
    const setEspacos = useEspacoStore((s) => s.setFromParse)
    const setEventos = useEventoStore((s) => s.setFromParse)
    const setPosts = useForumStore((s) => s.setFromParse)

    const syncAll = useCallback(async () => {
        try {
            const [espacos, avaliacoes, eventos, posts] = await Promise.all([
                buscarEspacos(),
                buscarAvaliacoes(),
                buscarEventos(),
                buscarPosts(),
            ])
            setEspacos(espacos, avaliacoes)
            setEventos(eventos)
            setPosts(posts)
        } catch (err) {
            console.error('[DataLoader] Erro ao sincronizar com Back4App:', err)
        }
    }, [setEspacos, setEventos, setPosts])

    useEffect(() => {
        if (appConfig.enableMock) return

        // Carga inicial
        syncAll()

        // Polling periódico — mantém o mapa atualizado sem LiveQuery
        const interval = setInterval(syncAll, POLL_INTERVAL_MS)

        return () => clearInterval(interval)
    }, [syncAll])

    return <>{children}</>
}

export default DataLoader
