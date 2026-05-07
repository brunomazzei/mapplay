import type { Avaliacao } from '@/types/espaco'

export const mockAvaliacoes: Avaliacao[] = [
    // Quadra do Ibirapuera (e1) — basquete validado
    { id: 'a1', espacoId: 'e1', nivel: 'otimo', criadoEm: '2025-03-12' },
    { id: 'a2', espacoId: 'e1', nivel: 'otimo', criadoEm: '2025-03-18' },
    { id: 'a3', espacoId: 'e1', nivel: 'otimo', criadoEm: '2025-04-01' },
    { id: 'a4', espacoId: 'e1', nivel: 'necessita_reparos', criadoEm: '2025-04-15' },
    { id: 'a5', espacoId: 'e1', nivel: 'otimo', criadoEm: '2025-05-02' },

    // Pelada da Vila Madalena (e2) — futebol validado
    { id: 'a6', espacoId: 'e2', nivel: 'necessita_reparos', criadoEm: '2025-04-05' },
    { id: 'a7', espacoId: 'e2', nivel: 'otimo', criadoEm: '2025-04-10' },
    { id: 'a8', espacoId: 'e2', nivel: 'necessita_reparos', criadoEm: '2025-04-20' },
    { id: 'a9', espacoId: 'e2', nivel: 'somente_revitalizacao', criadoEm: '2025-05-01' },

    // Pista da Consolação (e3) — skate validado
    { id: 'a10', espacoId: 'e3', nivel: 'otimo', criadoEm: '2025-02-20' },
    { id: 'a11', espacoId: 'e3', nivel: 'otimo', criadoEm: '2025-03-05' },
    { id: 'a12', espacoId: 'e3', nivel: 'otimo', criadoEm: '2025-04-08' },

    // Quadra do Parque Augusta (e4) — basquete validado
    { id: 'a13', espacoId: 'e4', nivel: 'otimo', criadoEm: '2025-05-02' },
    { id: 'a14', espacoId: 'e4', nivel: 'necessita_reparos', criadoEm: '2025-05-03' },
    { id: 'a15', espacoId: 'e4', nivel: 'necessita_reparos', criadoEm: '2025-05-04' },
]
