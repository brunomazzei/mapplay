import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockEspacos } from '@/mock/data/espacos'
import { mockAvaliacoes } from '@/mock/data/avaliacoes'
import type { Espaco, Avaliacao, AvaliacaoConservacao } from '@/types/espaco'

const RAIO_50M = 0.00045
const CONFIRMACOES_MINIMAS = 3

interface EspacoState {
    espacos: Espaco[]
    avaliacoes: Avaliacao[]
    setFromParse: (espacos: Espaco[], avaliacoes: Avaliacao[]) => void
    addRegistro: (
        dados: Omit<Espaco, 'id' | 'confirmacoes' | 'status' | 'criadoEm'>,
    ) => 'novo' | 'confirmado' | 'validado'
    confirmarEspaco: (
        id: string,
    ) => 'confirmado' | 'validado' | 'ja_validado'
    addAvaliacao: (
        dados: Omit<Avaliacao, 'id' | 'criadoEm'>,
    ) => void
    reset: () => void
}

export const useEspacoStore = create<EspacoState>()(
    persist(
        (set, get) => ({
            espacos: mockEspacos,
            avaliacoes: mockAvaliacoes,

            setFromParse: (espacos, avaliacoes) => set({ espacos, avaliacoes }),

            addRegistro: (dados) => {
                const state = get()
                const espacoProximo = state.espacos.find(
                    (e) =>
                        e.status === 'pendente' &&
                        e.modalidade === dados.modalidade &&
                        Math.abs(e.lat - dados.lat) < RAIO_50M &&
                        Math.abs(e.lng - dados.lng) < RAIO_50M,
                )

                if (espacoProximo) {
                    const novasConf = espacoProximo.confirmacoes + 1
                    const novoStatus =
                        novasConf >= CONFIRMACOES_MINIMAS ? 'validado' : 'pendente'
                    set((s) => ({
                        espacos: s.espacos.map((e) =>
                            e.id === espacoProximo.id
                                ? { ...e, confirmacoes: novasConf, status: novoStatus }
                                : e,
                        ),
                    }))
                    return novoStatus === 'validado' ? 'validado' : 'confirmado'
                }

                set((s) => ({
                    espacos: [
                        ...s.espacos,
                        {
                            ...dados,
                            id: `e${Date.now()}`,
                            confirmacoes: 1,
                            status: 'pendente' as const,
                            criadoEm: new Date().toISOString().split('T')[0],
                        },
                    ],
                }))
                return 'novo'
            },

            confirmarEspaco: (id) => {
                const state = get()
                const espaco = state.espacos.find((e) => e.id === id)
                if (!espaco || espaco.status === 'validado') return 'ja_validado'

                const novasConf = espaco.confirmacoes + 1
                const novoStatus =
                    novasConf >= CONFIRMACOES_MINIMAS ? 'validado' : 'pendente'

                set((s) => ({
                    espacos: s.espacos.map((e) =>
                        e.id === id
                            ? { ...e, confirmacoes: novasConf, status: novoStatus }
                            : e,
                    ),
                }))
                return novoStatus === 'validado' ? 'validado' : 'confirmado'
            },

            addAvaliacao: (dados) => {
                const novaAvaliacao: Avaliacao = {
                    ...dados,
                    id: `av${Date.now()}`,
                    criadoEm: new Date().toISOString().split('T')[0],
                }
                // Atualiza o campo avaliacao do espaço com o nível mais recente
                set((s) => ({
                    avaliacoes: [...s.avaliacoes, novaAvaliacao],
                    espacos: s.espacos.map((e) =>
                        e.id === dados.espacoId
                            ? { ...e, avaliacao: dados.nivel as AvaliacaoConservacao }
                            : e,
                    ),
                }))
            },

            reset: () =>
                set({ espacos: mockEspacos, avaliacoes: mockAvaliacoes }),
        }),
        { name: 'mapplay-espacos' },
    ),
)
