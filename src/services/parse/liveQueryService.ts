import Parse from '@/services/ParseConfig'
import type { Espaco, Modalidade, AvaliacaoConservacao } from '@/types/espaco'

const toEspaco = (obj: Parse.Object): Espaco => {
    const loc = obj.get('localizacao') as Parse.GeoPoint | undefined
    return {
        id: obj.id,
        nome: obj.get('nome'),
        modalidade: obj.get('modalidade') as Modalidade,
        lat: loc?.latitude ?? 0,
        lng: loc?.longitude ?? 0,
        status: obj.get('status'),
        confirmacoes: obj.get('confirmacoes') ?? 0,
        avaliacao: obj.get('avaliacao') as AvaliacaoConservacao | undefined,
        iluminacao: obj.get('iluminacao') ?? false,
        fotos: obj.get('fotos') ?? [],
        atributos: obj.get('atributos'),
        endereco: obj.get('endereco'),
        bairro: obj.get('bairro'),
        cidade: obj.get('cidade'),
        criadoEm: obj.get('criadoEm') ?? obj.createdAt?.toISOString().split('T')[0] ?? '',
    }
}

type UnsubscribeFn = () => void

export const subscribeToEspacos = async (
    onCreate: (espaco: Espaco) => void,
    onUpdate: (espaco: Espaco) => void,
    onDelete: (id: string) => void,
): Promise<UnsubscribeFn> => {
    const query = new Parse.Query('Espaco')
    const subscription = await query.subscribe()

    subscription.on('create', (obj) => onCreate(toEspaco(obj as Parse.Object)))
    subscription.on('update', (obj) => onUpdate(toEspaco(obj as Parse.Object)))
    subscription.on('delete', (obj) => onDelete((obj as Parse.Object).id))

    return () => subscription.unsubscribe()
}

export const subscribeToPostsForum = async (
    espacoId: string,
    onPost: (postId: string, autorNome: string, conteudo: string) => void,
): Promise<UnsubscribeFn> => {
    const espacoPointer = Parse.Object.fromJSON({ className: 'Espaco', objectId: espacoId })
    const query = new Parse.Query('PostForum')
    query.equalTo('espaco', espacoPointer)

    const subscription = await query.subscribe()
    subscription.on('create', (obj) => {
        const p = obj as Parse.Object
        onPost(p.id, p.get('autorNome') ?? 'Usuário', p.get('conteudo'))
    })

    return () => subscription.unsubscribe()
}
