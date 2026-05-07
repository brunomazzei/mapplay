import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockEventos } from '@/mock/data/eventos'
import type { Evento, TipoEvento } from '@/types/evento'
import type { Modalidade } from '@/types/espaco'

const USUARIO_MOCK = 'usuario-atual'

interface EventoState {
    eventos: Evento[]
    addEvento: (dados: Omit<Evento, 'id' | 'vagasRestantes' | 'participantes' | 'criadoEm'>) => string
    participar: (eventoId: string) => 'ok' | 'lotado' | 'ja_inscrito'
    sair: (eventoId: string) => void
    reset: () => void
}

export const useEventoStore = create<EventoState>()(
    persist(
        (set, get) => ({
            eventos: mockEventos,

            addEvento: (dados) => {
                const id = `ev${Date.now()}`
                const novoEvento: Evento = {
                    ...dados,
                    id,
                    vagasRestantes: dados.vagas,
                    participantes: [],
                    criadoEm: new Date().toISOString().split('T')[0],
                }
                set((s) => ({ eventos: [...s.eventos, novoEvento] }))
                return id
            },

            participar: (eventoId) => {
                const state = get()
                const evento = state.eventos.find((e) => e.id === eventoId)
                if (!evento) return 'lotado'
                if (evento.participantes.includes(USUARIO_MOCK)) return 'ja_inscrito'
                if (evento.vagasRestantes <= 0) return 'lotado'

                set((s) => ({
                    eventos: s.eventos.map((e) =>
                        e.id === eventoId
                            ? {
                                  ...e,
                                  vagasRestantes: e.vagasRestantes - 1,
                                  participantes: [...e.participantes, USUARIO_MOCK],
                              }
                            : e,
                    ),
                }))
                return 'ok'
            },

            sair: (eventoId) => {
                set((s) => ({
                    eventos: s.eventos.map((e) =>
                        e.id === eventoId
                            ? {
                                  ...e,
                                  vagasRestantes: e.vagasRestantes + 1,
                                  participantes: e.participantes.filter(
                                      (uid) => uid !== USUARIO_MOCK,
                                  ),
                              }
                            : e,
                    ),
                }))
            },

            reset: () => set({ eventos: mockEventos }),
        }),
        { name: 'mapplay-eventos' },
    ),
)

export const USUARIO_ATUAL = USUARIO_MOCK
