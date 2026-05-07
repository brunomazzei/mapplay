import { useNavigate, useParams } from 'react-router'
import { HiArrowLeft } from 'react-icons/hi2'
import { useEspacoStore } from '@/store/espacoStore'

const SpaceDetail = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const espaco = useEspacoStore((s) => s.espacos.find((e) => e.id === id))

    if (!espaco) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                Espaço não encontrado
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-y-auto">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <HiArrowLeft className="text-xl text-gray-700" />
                </button>
                <h4 className="font-bold text-gray-900">{espaco.nome}</h4>
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-6">
                <div>
                    <p className="text-4xl mb-3">
                        {espaco.modalidade === 'basquete' ? '🏀' : espaco.modalidade === 'futebol' ? '⚽' : '🛹'}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-1">{espaco.nome}</h3>
                    {espaco.bairro && (
                        <p className="text-sm text-gray-500 mb-4">
                            📍 {espaco.bairro}, {espaco.cidade}
                        </p>
                    )}
                    <p className="text-sm text-gray-400">
                        Detalhes completos — Fase 3
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SpaceDetail
