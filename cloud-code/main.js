/**
 * MapPlay — Back4App Cloud Code
 *
 * Deploy: Cole este conteúdo em Back4App > Cloud Code > main.js
 * e clique em "Deploy".
 */

const RAIO_50M_KM = 0.05
const CONFIRMACOES_MINIMAS = 3

// ─── RN02: Espaço deve ser público ───────────────────────────────────────────
Parse.Cloud.beforeSave('RegistroEspaco', (request) => {
    if (!request.object.get('isPublico')) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            'O espaço deve ser público (RN02).',
        )
    }
})

// ─── RN01: Consenso democrático ──────────────────────────────────────────────
Parse.Cloud.afterSave('RegistroEspaco', async (request) => {
    const registro = request.object
    const localizacao = registro.get('localizacao')
    const modalidade = registro.get('modalidade')

    if (!localizacao) return

    // Busca espaço pendente no raio de 50m com a mesma modalidade
    const queryPendente = new Parse.Query('Espaco')
    queryPendente.equalTo('modalidade', modalidade)
    queryPendente.equalTo('status', 'pendente')
    queryPendente.withinKilometers('localizacao', localizacao, RAIO_50M_KM)

    const espacoPendente = await queryPendente.first({ useMasterKey: true })

    if (espacoPendente) {
        // Incrementa confirmações no espaço existente
        const novasConf = (espacoPendente.get('confirmacoes') ?? 0) + 1
        espacoPendente.set('confirmacoes', novasConf)

        if (novasConf >= CONFIRMACOES_MINIMAS) {
            espacoPendente.set('status', 'validado')
        }
        await espacoPendente.save(null, { useMasterKey: true })
    } else {
        // Cria novo espaço pendente
        const Espaco = Parse.Object.extend('Espaco')
        const novoEspaco = new Espaco()

        novoEspaco.set('nome', registro.get('nome'))
        novoEspaco.set('modalidade', modalidade)
        novoEspaco.set('localizacao', localizacao)
        novoEspaco.set('status', 'pendente')
        novoEspaco.set('confirmacoes', 1)
        novoEspaco.set('iluminacao', registro.get('iluminacao') ?? false)
        novoEspaco.set('atributos', registro.get('atributos') ?? {})
        novoEspaco.set('bairro', registro.get('bairro') ?? '')
        novoEspaco.set('cidade', registro.get('cidade') ?? '')
        novoEspaco.set('criadoEm', new Date().toISOString().split('T')[0])

        const acl = new Parse.ACL()
        acl.setPublicReadAccess(true)
        acl.setPublicWriteAccess(false)
        novoEspaco.setACL(acl)

        await novoEspaco.save(null, { useMasterKey: true })
    }
})

// ─── Push: Notificar usuários próximos de mutirões ───────────────────────────
Parse.Cloud.afterSave('Evento', async (request) => {
    const evento = request.object
    if (!request.object.isNew()) return // só para novos eventos
    if (evento.get('tipo') !== 'mutirao') return

    const espacoId = evento.get('espaco')?.id
    if (!espacoId) return

    // Busca localização do espaço
    const queryEspaco = new Parse.Query('Espaco')
    const espaco = await queryEspaco.get(espacoId, { useMasterKey: true })
    const localizacao = espaco.get('localizacao')
    if (!localizacao) return

    // Envia push para instalações próximas (2km)
    const queryInstall = new Parse.Query(Parse.Installation)
    queryInstall.withinKilometers('localizacao', localizacao, 2)

    await Parse.Push.send(
        {
            where: queryInstall,
            data: {
                title: '🤝 Mutirão próximo de você!',
                body: `"${evento.get('nome')}" em ${espaco.get('nome')}`,
                sound: 'default',
                eventoId: evento.id,
            },
        },
        { useMasterKey: true },
    )
})

// ─── Segurança: impedir escrita anônima em classes sensíveis ─────────────────
Parse.Cloud.beforeSave('Avaliacao', (request) => {
    if (!request.user) {
        throw new Parse.Error(
            Parse.Error.SESSION_MISSING,
            'É preciso estar logado para avaliar.',
        )
    }
})

Parse.Cloud.beforeSave('PostForum', (request) => {
    if (!request.user) {
        throw new Parse.Error(
            Parse.Error.SESSION_MISSING,
            'É preciso estar logado para publicar no fórum.',
        )
    }
})

Parse.Cloud.beforeSave('Evento', (request) => {
    if (!request.user) {
        throw new Parse.Error(
            Parse.Error.SESSION_MISSING,
            'É preciso estar logado para criar eventos.',
        )
    }
})
