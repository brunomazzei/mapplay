import Parse from '@/services/ParseConfig'
import type { Evento, TipoEvento } from '@/types/evento'
import type { Modalidade } from '@/types/espaco'

const toEvento = (obj: Parse.Object): Evento => ({
    id: obj.id,
    tipo: obj.get('tipo') as TipoEvento,
    nome: obj.get('nome'),
    espacoId: obj.get('espaco')?.id ?? '',
    modalidade: obj.get('modalidade') as Modalidade | undefined,
    data: obj.get('data'),
    hora: obj.get('hora'),
    vagas: obj.get('vagas') ?? 0,
    vagasRestantes: obj.get('vagasRestantes') ?? 0,
    descricao: obj.get('descricao') ?? '',
    participantes: (obj.get('participantesIds') as string[]) ?? [],
    criadoPorId: obj.get('criador')?.id,
    criadoEm: obj.createdAt?.toISOString().split('T')[0] ?? '',
})

export const buscarEventos = async (): Promise<Evento[]> => {
    const query = new Parse.Query('Evento')
    query.include('espaco')
    query.limit(200)
    query.descending('data')
    const results = await query.find()
    return results.map(toEvento)
}

export const criarEvento = async (
    dados: Omit<Evento, 'id' | 'vagasRestantes' | 'participantes' | 'criadoEm'>,
): Promise<string> => {
    const Ev = Parse.Object.extend('Evento')
    const ev = new Ev()

    const espacoPointer = Parse.Object.fromJSON({ className: 'Espaco', objectId: dados.espacoId })
    ev.set('espaco', espacoPointer)
    ev.set('tipo', dados.tipo)
    ev.set('nome', dados.nome)
    ev.set('modalidade', dados.modalidade ?? null)
    ev.set('data', dados.data)
    ev.set('hora', dados.hora)
    ev.set('vagas', dados.vagas)
    ev.set('vagasRestantes', dados.vagas)
    ev.set('descricao', dados.descricao)
    ev.set('participantesIds', [])

    const user = Parse.User.current()
    if (user) ev.set('criador', user)

    const acl = new Parse.ACL()
    acl.setPublicReadAccess(true)
    acl.setPublicWriteAccess(false)
    if (user) acl.setWriteAccess(user, true)
    ev.setACL(acl)

    const saved = await ev.save()
    return saved.id
}

export const participarEvento = async (
    eventoId: string,
    userId: string,
): Promise<'ok' | 'lotado' | 'ja_inscrito'> => {
    const query = new Parse.Query('Evento')
    const ev = await query.get(eventoId)

    const ids: string[] = ev.get('participantesIds') ?? []
    if (ids.includes(userId)) return 'ja_inscrito'
    if ((ev.get('vagasRestantes') ?? 0) <= 0) return 'lotado'

    ev.set('participantesIds', [...ids, userId])
    ev.set('vagasRestantes', ev.get('vagasRestantes') - 1)
    await ev.save()
    return 'ok'
}

export const sairEvento = async (eventoId: string, userId: string) => {
    const query = new Parse.Query('Evento')
    const ev = await query.get(eventoId)

    const ids: string[] = ev.get('participantesIds') ?? []
    ev.set('participantesIds', ids.filter((id) => id !== userId))
    ev.set('vagasRestantes', (ev.get('vagasRestantes') ?? 0) + 1)
    await ev.save()
}
