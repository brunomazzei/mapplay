export type Modalidade = 'basquete' | 'futebol' | 'skate'

export type StatusEspaco = 'validado' | 'pendente'

export type AvaliacaoConservacao =
    | 'otimo'
    | 'necessita_reparos'
    | 'somente_revitalizacao'

export type AtributosBasquete = {
    alturaCesta: 'regulamentar' | 'baixa' | 'adaptada'
}

export type AtributosFutebol = {
    tipoGramado: 'natural' | 'sintetico' | 'areia' | 'cimento'
}

export type AtributosSkate = {
    tipoObstaculo: 'bowl' | 'half_pipe' | 'street' | 'flatground'
}

export type Espaco = {
    id: string
    nome: string
    modalidade: Modalidade
    lat: number
    lng: number
    status: StatusEspaco
    confirmacoes: number
    avaliacao?: AvaliacaoConservacao
    iluminacao: boolean
    fotos?: string[]
    atributos?: AtributosBasquete | AtributosFutebol | AtributosSkate
    endereco?: string
    bairro?: string
    cidade?: string
    criadoEm: string
}

export type Avaliacao = {
    id: string
    espacoId: string
    nivel: AvaliacaoConservacao
    fotoUrl?: string
    userId?: string
    criadoEm: string
}
