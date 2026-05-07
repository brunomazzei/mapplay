export type TipoPost = 'discussao' | 'mobilizacao'

export type PostForum = {
    id: string
    espacoId: string
    conteudo: string
    autorId: string
    autorNome: string
    tipo: TipoPost
    curtidas: string[]
    criadoEm: string
}
