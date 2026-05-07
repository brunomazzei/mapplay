import Parse from '@/services/ParseConfig'
import type { PostForum, TipoPost } from '@/types/forum'

const toPost = (obj: Parse.Object): PostForum => ({
    id: obj.id,
    espacoId: obj.get('espaco')?.id ?? '',
    conteudo: obj.get('conteudo'),
    autorId: obj.get('autor')?.id ?? '',
    autorNome: obj.get('autorNome') ?? 'Usuário',
    tipo: obj.get('tipo') as TipoPost,
    curtidas: (obj.get('curtidasIds') as string[]) ?? [],
    criadoEm: obj.createdAt?.toISOString() ?? '',
})

export const buscarPosts = async (): Promise<PostForum[]> => {
    const query = new Parse.Query('PostForum')
    query.include('espaco', 'autor')
    query.limit(500)
    query.ascending('createdAt')
    const results = await query.find()
    return results.map(toPost)
}

export const criarPost = async (
    espacoId: string,
    conteudo: string,
    tipo: TipoPost,
): Promise<PostForum> => {
    const Post = Parse.Object.extend('PostForum')
    const post = new Post()

    const espacoPointer = Parse.Object.fromJSON({ className: 'Espaco', objectId: espacoId })
    post.set('espaco', espacoPointer)
    post.set('conteudo', conteudo)
    post.set('tipo', tipo)
    post.set('curtidasIds', [])

    const user = Parse.User.current()
    if (user) {
        post.set('autor', user)
        post.set('autorNome', user.get('nome') ?? user.getUsername() ?? 'Usuário')
    } else {
        post.set('autorNome', 'Usuário')
    }

    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    post.setACL(acl)

    const saved = await post.save()
    return toPost(saved)
}

export const toggleCurtida = async (postId: string, userId: string) => {
    const query = new Parse.Query('PostForum')
    const post = await query.get(postId)

    const ids: string[] = post.get('curtidasIds') ?? []
    const next = ids.includes(userId)
        ? ids.filter((id) => id !== userId)
        : [...ids, userId]

    post.set('curtidasIds', next)
    await post.save()
}
