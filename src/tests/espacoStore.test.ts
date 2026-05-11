import { describe, it, expect, beforeEach } from 'vitest'
import { useEspacoStore } from '@/store/espacoStore'

// Reset do store entre testes
beforeEach(() => {
    useEspacoStore.getState().reset()
})

describe('espacoStore — addRegistro', () => {
    it('cria novo espaço quando não há espaço próximo', () => {
        const antes = useEspacoStore.getState().espacos.length

        useEspacoStore.getState().addRegistro({
            nome: 'Quadra Teste',
            modalidade: 'basquete',
            lat: -10.0,
            lng: -50.0,
            iluminacao: false,
            atributos: {},
        })

        const depois = useEspacoStore.getState().espacos.length
        expect(depois).toBe(antes + 1)

        const criado = useEspacoStore
            .getState()
            .espacos.find((e) => e.nome === 'Quadra Teste')
        expect(criado).toBeDefined()
        expect(criado?.status).toBe('pendente')
        expect(criado?.confirmacoes).toBe(1)
    })

    it('retorna "novo" quando espaço é criado', () => {
        const resultado = useEspacoStore.getState().addRegistro({
            nome: 'Quadra Isolada',
            modalidade: 'skate',
            lat: -5.0,
            lng: -35.0,
            iluminacao: true,
            atributos: {},
        })

        expect(resultado).toBe('novo')
    })

    it('confirma espaço próximo em vez de criar duplicata', () => {
        // Cria o espaço inicial
        useEspacoStore.getState().addRegistro({
            nome: 'Quadra Original',
            modalidade: 'futebol',
            lat: -23.55,
            lng: -46.63,
            iluminacao: false,
            atributos: {},
        })

        const antesCount = useEspacoStore.getState().espacos.length

        // Tenta registrar no mesmo local (dentro de 50m)
        const resultado = useEspacoStore.getState().addRegistro({
            nome: 'Quadra Original',
            modalidade: 'futebol',
            lat: -23.5501,
            lng: -46.6301,
            iluminacao: false,
            atributos: {},
        })

        expect(resultado).toBe('confirmado')
        expect(useEspacoStore.getState().espacos.length).toBe(antesCount) // não criou novo
        const espaco = useEspacoStore
            .getState()
            .espacos.find((e) => e.nome === 'Quadra Original')
        expect(espaco?.confirmacoes).toBe(2)
    })

    it('valida espaço ao atingir 3 confirmações', () => {
        useEspacoStore.getState().addRegistro({
            nome: 'Quadra p/ Validar',
            modalidade: 'basquete',
            lat: -20.0,
            lng: -44.0,
            iluminacao: true,
            atributos: {},
        })

        useEspacoStore.getState().addRegistro({
            nome: 'Quadra p/ Validar',
            modalidade: 'basquete',
            lat: -20.0001,
            lng: -44.0001,
            iluminacao: true,
            atributos: {},
        })

        const resultado = useEspacoStore.getState().addRegistro({
            nome: 'Quadra p/ Validar',
            modalidade: 'basquete',
            lat: -20.0002,
            lng: -44.0002,
            iluminacao: true,
            atributos: {},
        })

        expect(resultado).toBe('validado')
        const espaco = useEspacoStore
            .getState()
            .espacos.find((e) => e.nome === 'Quadra p/ Validar')
        expect(espaco?.status).toBe('validado')
        expect(espaco?.confirmacoes).toBe(3)
    })
})

describe('espacoStore — confirmarEspaco', () => {
    it('incrementa confirmações de espaço pendente', () => {
        useEspacoStore.getState().addRegistro({
            nome: 'Para Confirmar',
            modalidade: 'skate',
            lat: -15.0,
            lng: -47.0,
            iluminacao: false,
            atributos: {},
        })

        const espaco = useEspacoStore
            .getState()
            .espacos.find((e) => e.nome === 'Para Confirmar')!

        useEspacoStore.getState().confirmarEspaco(espaco.id)

        const atualizado = useEspacoStore
            .getState()
            .espacos.find((e) => e.id === espaco.id)!
        expect(atualizado.confirmacoes).toBe(2)
    })

    it('retorna "ja_validado" para espaço já validado', () => {
        // Cria e valida o espaço (3 confirmações)
        useEspacoStore.getState().addRegistro({
            nome: 'Já Validado',
            modalidade: 'futebol',
            lat: -12.0,
            lng: -49.0,
            iluminacao: true,
            atributos: {},
        })
        useEspacoStore.getState().addRegistro({
            nome: 'Já Validado',
            modalidade: 'futebol',
            lat: -12.0001,
            lng: -49.0001,
            iluminacao: true,
            atributos: {},
        })
        useEspacoStore.getState().addRegistro({
            nome: 'Já Validado',
            modalidade: 'futebol',
            lat: -12.0002,
            lng: -49.0002,
            iluminacao: true,
            atributos: {},
        })

        const espaco = useEspacoStore
            .getState()
            .espacos.find((e) => e.nome === 'Já Validado')!
        expect(espaco.status).toBe('validado')

        const resultado = useEspacoStore.getState().confirmarEspaco(espaco.id)
        expect(resultado).toBe('ja_validado')
    })
})

describe('espacoStore — addAvaliacao', () => {
    it('adiciona avaliação e atualiza o campo avaliacao do espaço', () => {
        useEspacoStore.getState().addRegistro({
            nome: 'Para Avaliar',
            modalidade: 'basquete',
            lat: -3.0,
            lng: -60.0,
            iluminacao: false,
            atributos: {},
        })

        const espaco = useEspacoStore
            .getState()
            .espacos.find((e) => e.nome === 'Para Avaliar')!

        useEspacoStore.getState().addAvaliacao({
            espacoId: espaco.id,
            nivel: 'otimo',
        })

        const avs = useEspacoStore.getState().avaliacoes
        const av = avs.find((a) => a.espacoId === espaco.id)
        expect(av).toBeDefined()
        expect(av?.nivel).toBe('otimo')

        const espacoAtualizado = useEspacoStore
            .getState()
            .espacos.find((e) => e.id === espaco.id)!
        expect(espacoAtualizado.avaliacao).toBe('otimo')
    })
})
