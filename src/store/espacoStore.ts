import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockEspacos } from '@/mock/data/espacos'
import type { Espaco } from '@/types/espaco'

const RAIO_50M = 0.00045 // ~50 metros em graus de latitude
const CONFIRMACOES_MINIMAS = 3

interface EspacoState {
    espacos: Espaco[]
    addRegistro: (novoEspaco: Omit<Espaco, 'id' | 'confirmacoes' | 'status' | 'criadoEm'>) => 'novo' | 'confirmado' | 'validado'
    reset: () => void
}

export const useEspacoStore = create<EspacoState>()(
    persist(
        (set, get) => ({
            espacos: mockEspacos,

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
                    const novasConfirmacoes = espacoProximo.confirmacoes + 1
                    const novoStatus =
                        novasConfirmacoes >= CONFIRMACOES_MINIMAS
                            ? 'validado'
                            : 'pendente'

                    set((s) => ({
                        espacos: s.espacos.map((e) =>
                            e.id === espacoProximo.id
                                ? { ...e, confirmacoes: novasConfirmacoes, status: novoStatus }
                                : e,
                        ),
                    }))

                    return novoStatus === 'validado' ? 'validado' : 'confirmado'
                }

                const novoEspaco: Espaco = {
                    ...dados,
                    id: `e${Date.now()}`,
                    confirmacoes: 1,
                    status: 'pendente',
                    criadoEm: new Date().toISOString().split('T')[0],
                }

                set((s) => ({ espacos: [...s.espacos, novoEspaco] }))
                return 'novo'
            },

            reset: () => set({ espacos: mockEspacos }),
        }),
        { name: 'mapplay-espacos' },
    ),
)
