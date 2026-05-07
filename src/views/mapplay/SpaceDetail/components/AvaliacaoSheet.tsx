import { useState } from 'react'
import { HiOutlineXMark, HiOutlineCamera } from 'react-icons/hi2'
import Button from '@/components/ui/Button'
import classNames from 'classnames'
import type { AvaliacaoConservacao } from '@/types/espaco'

interface AvaliacaoSheetProps {
    open: boolean
    onClose: () => void
    onSubmit: (nivel: AvaliacaoConservacao) => void
}

const OPCOES: {
    nivel: AvaliacaoConservacao
    icon: string
    label: string
    descricao: string
    border: string
    selected: string
}[] = [
    {
        nivel: 'otimo',
        icon: '✅',
        label: 'Ótimo',
        descricao: 'Espaço em boas condições, pronto para uso',
        border: 'border-green-200',
        selected: 'border-green-500 bg-green-50',
    },
    {
        nivel: 'necessita_reparos',
        icon: '⚠️',
        label: 'Necessita de reparos',
        descricao: 'Utilizável, mas com problemas que precisam de atenção',
        border: 'border-yellow-200',
        selected: 'border-yellow-500 bg-yellow-50',
    },
    {
        nivel: 'somente_revitalizacao',
        icon: '🚫',
        label: 'Somente com revitalização',
        descricao: 'Espaço degradado, necessita de intervenção completa',
        border: 'border-red-200',
        selected: 'border-red-500 bg-red-50',
    },
]

const AvaliacaoSheet = ({ open, onClose, onSubmit }: AvaliacaoSheetProps) => {
    const [selected, setSelected] = useState<AvaliacaoConservacao | null>(null)
    const [isSubmitting, setSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!selected) return
        setSubmitting(true)
        await new Promise((r) => setTimeout(r, 500))
        onSubmit(selected)
        setSelected(null)
        setSubmitting(false)
        onClose()
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={classNames(
                    'fixed inset-0 bg-black/50 z-[2000] transition-opacity duration-300',
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
                )}
                onClick={onClose}
            />

            {/* Bottom sheet */}
            <div
                className={classNames(
                    'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[2001] transition-transform duration-300 pb-safe',
                    open ? 'translate-y-0' : 'translate-y-full',
                )}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="px-4 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900">
                            Avaliar conservação
                        </h4>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                        >
                            <HiOutlineXMark className="text-xl text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-2 mb-4">
                        {OPCOES.map((op) => (
                            <button
                                key={op.nivel}
                                type="button"
                                onClick={() => setSelected(op.nivel)}
                                className={classNames(
                                    'w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-colors',
                                    selected === op.nivel
                                        ? op.selected
                                        : `border-gray-100 hover:${op.border}`,
                                )}
                            >
                                <span className="text-2xl leading-none mt-0.5">
                                    {op.icon}
                                </span>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">
                                        {op.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {op.descricao}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Foto placeholder */}
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 mb-4">
                        <HiOutlineCamera className="text-lg" />
                        <span>Adicionar foto (opcional) — Fase 7</span>
                    </button>

                    <Button
                        block
                        variant="solid"
                        disabled={!selected}
                        loading={isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AvaliacaoSheet
