import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks hoisted ────────────────────────────────────────────────────────────
const { mockSetFn, mockSetACLFn, mockSaveFn, mockEspacoObj, mockAvaliacaoObj } = vi.hoisted(() => {
    const mockSetFn = vi.fn()
    const mockSetACLFn = vi.fn()
    const mockSaveFn = vi.fn().mockResolvedValue(undefined)

    const mockEspacoObj = {
        id: 'espaco123',
        get: (key: string) => {
            const data: Record<string, unknown> = {
                nome: 'Quadra Central',
                modalidade: 'basquete',
                localizacao: { latitude: -23.55, longitude: -46.63 },
                status: 'pendente',
                confirmacoes: 1,
                iluminacao: true,
                fotos: [],
                atributos: { alturaCesta: 'regulamentar' },
                endereco: 'Rua A, 100',
                bairro: 'Centro',
                cidade: 'São Paulo',
                criadoEm: '2025-01-01',
            }
            return data[key]
        },
        set: vi.fn(),
        save: vi.fn().mockResolvedValue(undefined),
        createdAt: new Date('2025-01-01'),
    }

    const mockAvaliacaoObj = {
        id: 'av123',
        get: (key: string) => {
            const data: Record<string, unknown> = {
                espaco: { id: 'espaco123' },
                nivel: 'otimo',
                fotoUrl: null,
                autor: { id: 'user123' },
            }
            return data[key]
        },
        createdAt: new Date('2025-01-01'),
    }

    return { mockSetFn, mockSetACLFn, mockSaveFn, mockEspacoObj, mockAvaliacaoObj }
})

// ─── Mock do Parse (construtores com function keyword) ───────────────────────
vi.mock('@/services/ParseConfig', () => {
    // Query — construtor com function (não arrow)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockQuery = vi.fn(function (this: any) {
        this.limit = vi.fn().mockReturnThis()
        this.descending = vi.fn().mockReturnThis()
        this.include = vi.fn().mockReturnThis()
        this.find = vi.fn().mockResolvedValue([mockEspacoObj])
        this.get = vi.fn().mockResolvedValue(mockEspacoObj)
    })

    // ACL — construtor com function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockACL = vi.fn(function (this: any) {
        this.setPublicReadAccess = vi.fn()
        this.setPublicWriteAccess = vi.fn()
        this.setWriteAccess = vi.fn()
    })

    // GeoPoint — construtor com function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MockGeoPoint = vi.fn(function (this: any, lat: number, lng: number) {
        this.latitude = lat
        this.longitude = lng
    })

    // Object.extend retorna um construtor (function) que cria o objeto Parse
    const MockExtend = vi.fn().mockImplementation(function () {
        // Retorna uma função construtora (não arrow!)
        return function (this: Record<string, unknown>) {
            this.set = mockSetFn
            this.setACL = mockSetACLFn
            this.save = mockSaveFn
        }
    })

    return {
        default: {
            Query: MockQuery,
            ACL: MockACL,
            GeoPoint: MockGeoPoint,
            User: {
                current: vi.fn().mockReturnValue({ id: 'currentUser' }),
            },
            Object: {
                extend: MockExtend,
                fromJSON: vi.fn().mockReturnValue({ className: 'Espaco', objectId: 'espaco123' }),
            },
        },
    }
})

import Parse from '@/services/ParseConfig'
import {
    buscarEspacos,
    registrarEspaco,
    confirmarEspaco,
    buscarAvaliacoes,
    addAvaliacao,
} from '@/services/parse/espacoService'
import type { Espaco } from '@/types/espaco'

const MockQuery = Parse.Query as unknown as ReturnType<typeof vi.fn>
const MockGeoPoint = Parse.GeoPoint as unknown as ReturnType<typeof vi.fn>

// ─── buscarEspacos ─────────────────────────────────────────────
describe('buscarEspacos', () => {
    beforeEach(() => vi.clearAllMocks())

    it('retorna lista de espaços mapeados do Parse', async () => {
        const espacos = await buscarEspacos()

        expect(espacos).toHaveLength(1)
        expect(espacos[0].id).toBe('espaco123')
        expect(espacos[0].nome).toBe('Quadra Central')
        expect(espacos[0].modalidade).toBe('basquete')
        expect(espacos[0].lat).toBe(-23.55)
        expect(espacos[0].lng).toBe(-46.63)
        expect(espacos[0].status).toBe('pendente')
        expect(espacos[0].bairro).toBe('Centro')
    })

    it('cria query para classe Espaco', async () => {
        await buscarEspacos()

        expect(MockQuery).toHaveBeenCalledWith('Espaco')
    })

    it('retorna lista vazia quando não há espaços', async () => {
        const queryInstance = MockQuery.mock.results[MockQuery.mock.results.length - 1]?.value
        if (queryInstance) queryInstance.find.mockResolvedValueOnce([])

        // Reset o mock para retornar lista vazia
        MockQuery.mockImplementationOnce(function (this: Record<string, unknown>) {
            this.limit = vi.fn().mockReturnThis()
            this.descending = vi.fn().mockReturnThis()
            this.include = vi.fn().mockReturnThis()
            this.find = vi.fn().mockResolvedValue([])
            this.get = vi.fn()
        })

        const espacos = await buscarEspacos()
        expect(espacos).toHaveLength(0)
    })
})

// ─── registrarEspaco ───────────────────────────────────────────
describe('registrarEspaco', () => {
    beforeEach(() => vi.clearAllMocks())

    const dadosEspaco = {
        nome: 'Quadra Nova',
        modalidade: 'futebol' as const,
        lat: -23.5,
        lng: -46.6,
        iluminacao: false,
        atributos: { tipoGramado: 'natural' as const },
    }

    it('cria objeto RegistroEspaco no Parse e chama save()', async () => {
        await registrarEspaco(dadosEspaco)

        expect(Parse.Object.extend).toHaveBeenCalledWith('RegistroEspaco')
        expect(mockSaveFn).toHaveBeenCalledOnce()
    })

    it('salva os campos obrigatórios no registro', async () => {
        await registrarEspaco(dadosEspaco)

        expect(mockSetFn).toHaveBeenCalledWith('nome', 'Quadra Nova')
        expect(mockSetFn).toHaveBeenCalledWith('modalidade', 'futebol')
        expect(mockSetFn).toHaveBeenCalledWith('iluminacao', false)
        expect(mockSetFn).toHaveBeenCalledWith('isPublico', true)
    })

    it('associa o usuário atual como autor', async () => {
        await registrarEspaco(dadosEspaco)

        expect(mockSetFn).toHaveBeenCalledWith('autor', { id: 'currentUser' })
    })

    it('define ACL com leitura pública', async () => {
        await registrarEspaco(dadosEspaco)

        expect(mockSetACLFn).toHaveBeenCalledOnce()
    })

    it('usa GeoPoint com as coordenadas informadas', async () => {
        await registrarEspaco(dadosEspaco)

        expect(MockGeoPoint).toHaveBeenCalledWith(-23.5, -46.6)
    })
})

// ─── confirmarEspaco ───────────────────────────────────────────
describe('confirmarEspaco', () => {
    beforeEach(() => vi.clearAllMocks())

    const espacoExistente: Espaco = {
        id: 'espaco123',
        nome: 'Quadra Central',
        modalidade: 'basquete',
        lat: -23.55,
        lng: -46.63,
        status: 'pendente',
        confirmacoes: 1,
        iluminacao: true,
        fotos: [],
        atributos: {},
        criadoEm: '2025-01-01',
    }

    it('cria RegistroEspaco com os dados do espaço existente', async () => {
        await confirmarEspaco(espacoExistente)

        expect(Parse.Object.extend).toHaveBeenCalledWith('RegistroEspaco')
        expect(mockSetFn).toHaveBeenCalledWith('nome', 'Quadra Central')
        expect(mockSetFn).toHaveBeenCalledWith('modalidade', 'basquete')
        expect(mockSetFn).toHaveBeenCalledWith('isPublico', true)
        expect(mockSaveFn).toHaveBeenCalledOnce()
    })

    it('usa as coordenadas exatas do espaço no GeoPoint', async () => {
        await confirmarEspaco(espacoExistente)

        expect(MockGeoPoint).toHaveBeenCalledWith(-23.55, -46.63)
    })
})

// ─── buscarAvaliacoes ──────────────────────────────────────────
describe('buscarAvaliacoes', () => {
    beforeEach(() => vi.clearAllMocks())

    it('retorna avaliações mapeadas do Parse', async () => {
        MockQuery.mockImplementationOnce(function (this: Record<string, unknown>) {
            this.limit = vi.fn().mockReturnThis()
            this.descending = vi.fn().mockReturnThis()
            this.include = vi.fn().mockReturnThis()
            this.find = vi.fn().mockResolvedValue([mockAvaliacaoObj])
            this.get = vi.fn()
        })

        const avaliacoes = await buscarAvaliacoes()

        expect(avaliacoes).toHaveLength(1)
        expect(avaliacoes[0].id).toBe('av123')
        expect(avaliacoes[0].espacoId).toBe('espaco123')
        expect(avaliacoes[0].nivel).toBe('otimo')
    })
})

// ─── addAvaliacao ──────────────────────────────────────────────
describe('addAvaliacao', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // addAvaliacao faz uma query extra para atualizar o Espaco
        MockQuery.mockImplementation(function (this: Record<string, unknown>) {
            this.limit = vi.fn().mockReturnThis()
            this.descending = vi.fn().mockReturnThis()
            this.include = vi.fn().mockReturnThis()
            this.find = vi.fn().mockResolvedValue([mockEspacoObj])
            this.get = vi.fn().mockResolvedValue(mockEspacoObj)
        })
    })

    it('salva Avaliacao com o nível correto', async () => {
        await addAvaliacao('espaco123', 'otimo')

        expect(Parse.Object.extend).toHaveBeenCalledWith('Avaliacao')
        expect(mockSetFn).toHaveBeenCalledWith('nivel', 'otimo')
    })

    it('define fotoUrl quando fornecida', async () => {
        await addAvaliacao('espaco123', 'necessita_reparos', 'https://foto.url/img.jpg')

        expect(mockSetFn).toHaveBeenCalledWith('fotoUrl', 'https://foto.url/img.jpg')
    })

    it('não define fotoUrl quando ausente', async () => {
        await addAvaliacao('espaco123', 'otimo')

        const fotoUrlCall = vi.mocked(mockSetFn).mock.calls.find(([key]) => key === 'fotoUrl')
        expect(fotoUrlCall).toBeUndefined()
    })
})
