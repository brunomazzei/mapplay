import Parse from '@/services/ParseConfig'
import type { Espaco, Modalidade, AvaliacaoConservacao, Avaliacao } from '@/types/espaco'

// ─── Mappers ──────────────────────────────────────────────────

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

const toAvaliacao = (obj: Parse.Object): Avaliacao => ({
    id: obj.id,
    espacoId: obj.get('espaco')?.id ?? '',
    nivel: obj.get('nivel') as AvaliacaoConservacao,
    fotoUrl: obj.get('fotoUrl'),
    userId: obj.get('autor')?.id,
    criadoEm: obj.createdAt?.toISOString() ?? '',
})

// ─── Espaços ──────────────────────────────────────────────────

export const buscarEspacos = async (): Promise<Espaco[]> => {
    const query = new Parse.Query('Espaco')
    query.limit(500)
    query.descending('createdAt')
    const results = await query.find()
    return results.map(toEspaco)
}

export const registrarEspaco = async (
    dados: Omit<Espaco, 'id' | 'confirmacoes' | 'status' | 'criadoEm'>,
) => {
    const Registro = Parse.Object.extend('RegistroEspaco')
    const registro = new Registro()

    registro.set('nome', dados.nome)
    registro.set('modalidade', dados.modalidade)
    registro.set('localizacao', new Parse.GeoPoint(dados.lat, dados.lng))
    registro.set('iluminacao', dados.iluminacao)
    registro.set('atributos', dados.atributos ?? {})
    registro.set('bairro', dados.bairro ?? '')
    registro.set('cidade', dados.cidade ?? '')
    registro.set('isPublico', true)

    const user = Parse.User.current()
    if (user) registro.set('autor', user)

    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    registro.setACL(acl)

    // O Cloud Code (afterSave) cuida do consenso RN01
    await registro.save()
}

/**
 * Confirma que um espaço existe criando um novo RegistroEspaco.
 * O Cloud Code afterSave detecta o espaço próximo e incrementa
 * confirmacoes via masterKey (RN01).
 */
export const confirmarEspaco = async (espaco: Espaco) => {
    const Registro = Parse.Object.extend('RegistroEspaco')
    const registro = new Registro()

    registro.set('nome', espaco.nome)
    registro.set('modalidade', espaco.modalidade)
    registro.set('localizacao', new Parse.GeoPoint(espaco.lat, espaco.lng))
    registro.set('iluminacao', espaco.iluminacao)
    registro.set('atributos', espaco.atributos ?? {})
    registro.set('bairro', espaco.bairro ?? '')
    registro.set('cidade', espaco.cidade ?? '')
    registro.set('isPublico', true)

    const user = Parse.User.current()
    if (user) registro.set('autor', user)

    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    registro.setACL(acl)

    await registro.save()
}

// ─── Avaliações ───────────────────────────────────────────────

export const buscarAvaliacoes = async (): Promise<Avaliacao[]> => {
    const query = new Parse.Query('Avaliacao')
    query.include('espaco')
    query.limit(1000)
    const results = await query.find()
    return results.map(toAvaliacao)
}

export const addAvaliacao = async (
    espacoId: string,
    nivel: AvaliacaoConservacao,
    fotoUrl?: string,
) => {
    const Avaliacao = Parse.Object.extend('Avaliacao')
    const av = new Avaliacao()

    const espacoPointer = Parse.Object.fromJSON({ className: 'Espaco', objectId: espacoId })
    av.set('espaco', espacoPointer)
    av.set('nivel', nivel)
    if (fotoUrl) av.set('fotoUrl', fotoUrl)

    const user = Parse.User.current()
    if (user) av.set('autor', user)

    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    av.setACL(acl)

    await av.save()

    // Atualiza campo de avaliação no espaço
    const espacoQuery = new Parse.Query('Espaco')
    const espaco = await espacoQuery.get(espacoId)
    espaco.set('avaliacao', nivel)
    await espaco.save()
}
