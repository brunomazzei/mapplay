import type { Modalidade } from './espaco'

export type TipoEvento = 'esportivo' | 'mutirao'

export type Evento = {
    id: string
    tipo: TipoEvento
    nome: string
    espacoId: string
    modalidade?: Modalidade
    data: string        // YYYY-MM-DD
    hora: string        // HH:mm
    vagas: number
    vagasRestantes: number
    descricao: string
    participantes: string[]
    criadoPorId?: string
    criadoEm: string
}
