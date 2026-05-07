import type { PostForum } from '@/types/forum'

export const mockPosts: PostForum[] = [
    // Quadra do Ibirapuera (e1)
    {
        id: 'p1', espacoId: 'e1',
        conteudo: 'Pessoal, a quadra está excelente essa semana! Acabaram de pintar as linhas. Recomendo muito.',
        autorId: 'u3', autorNome: 'Marcos Andrade',
        tipo: 'discussao', curtidas: ['u1', 'u2', 'u5'],
        criadoEm: '2026-05-05T14:30:00',
    },
    {
        id: 'p2', espacoId: 'e1',
        conteudo: 'Alguém sabe o horário de funcionamento do parque? Quero levar meu filho no fim de semana.',
        autorId: 'u7', autorNome: 'Renata Silva',
        tipo: 'discussao', curtidas: ['u3'],
        criadoEm: '2026-05-06T09:15:00',
    },
    {
        id: 'p3', espacoId: 'e1',
        conteudo: 'Abre às 6h e fecha às 22h todos os dias! Aproveitem.',
        autorId: 'u1', autorNome: 'João Costa',
        tipo: 'discussao', curtidas: ['u7', 'u9'],
        criadoEm: '2026-05-06T10:02:00',
    },

    // Pelada da Vila Madalena (e2)
    {
        id: 'p4', espacoId: 'e2',
        conteudo: 'O campo está com mato alto e as traves enferrujadas. Precisamos organizar uma força-tarefa antes do inverno.',
        autorId: 'u5', autorNome: 'Carla Mendes',
        tipo: 'mobilizacao', curtidas: ['u1', 'u2', 'u3', 'u8', 'u12'],
        criadoEm: '2026-05-04T18:00:00',
    },
    {
        id: 'p5', espacoId: 'e2',
        conteudo: 'Topei! Tenho ferramentas de jardinagem. Quando marcamos?',
        autorId: 'u8', autorNome: 'Pedro Rocha',
        tipo: 'discussao', curtidas: ['u5'],
        criadoEm: '2026-05-04T20:45:00',
    },
    {
        id: 'p6', espacoId: 'e2',
        conteudo: 'Criei um mutirão para o dia 17/05. Confirma presença lá no evento! Precisamos de pelo menos 10 pessoas.',
        autorId: 'u5', autorNome: 'Carla Mendes',
        tipo: 'mobilizacao', curtidas: ['u8', 'u1', 'u4'],
        criadoEm: '2026-05-06T08:30:00',
    },

    // Pista da Consolação (e3)
    {
        id: 'p7', espacoId: 'e3',
        conteudo: 'Pista ótima! Galera super respeitosa. Bom lugar pra quem está aprendendo.',
        autorId: 'u2', autorNome: 'Lucas Ferreira',
        tipo: 'discussao', curtidas: ['u9', 'u10', 'u11'],
        criadoEm: '2026-05-03T16:20:00',
    },
    {
        id: 'p8', espacoId: 'e3',
        conteudo: 'Tem algum professor de skate que dá aula aqui? Vi uns moleques treinando muito bem.',
        autorId: 'u15', autorNome: 'Ana Lima',
        tipo: 'discussao', curtidas: ['u2'],
        criadoEm: '2026-05-06T11:00:00',
    },

    // Quadra do Parque Augusta (e4)
    {
        id: 'p9', espacoId: 'e4',
        conteudo: 'A cesta do lado esquerdo está com o aro torto. Alguém já acionou a subprefeitura?',
        autorId: 'u4', autorNome: 'Fernanda Costa',
        tipo: 'mobilizacao', curtidas: ['u6', 'u13'],
        criadoEm: '2026-05-05T13:00:00',
    },
    {
        id: 'p10', espacoId: 'e4',
        conteudo: 'Registrei uma reclamação pelo SP156. Protocolo 2026/12345. Vamos pressionar juntos!',
        autorId: 'u6', autorNome: 'Ricardo Nunes',
        tipo: 'mobilizacao', curtidas: ['u4', 'u13', 'u14'],
        criadoEm: '2026-05-06T07:45:00',
    },
]
