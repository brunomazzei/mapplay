import classNames from 'classnames'
import type { AvaliacaoConservacao, Avaliacao } from '@/types/espaco'

interface EvaluationBarProps {
    avaliacoes: Avaliacao[]
}

const NIVEIS: {
    key: AvaliacaoConservacao
    label: string
    icon: string
    color: string
    bg: string
}[] = [
    {
        key: 'otimo',
        label: 'Ótimo',
        icon: '✅',
        color: 'bg-green-500',
        bg: 'bg-green-50 text-green-700',
    },
    {
        key: 'necessita_reparos',
        label: 'Necessita reparos',
        icon: '⚠️',
        color: 'bg-yellow-400',
        bg: 'bg-yellow-50 text-yellow-700',
    },
    {
        key: 'somente_revitalizacao',
        label: 'Só com revitalização',
        icon: '🚫',
        color: 'bg-red-500',
        bg: 'bg-red-50 text-red-700',
    },
]

const EvaluationBar = ({ avaliacoes }: EvaluationBarProps) => {
    const total = avaliacoes.length
    if (total === 0) {
        return (
            <p className="text-sm text-gray-400 text-center py-2">
                Nenhuma avaliação ainda. Seja o primeiro!
            </p>
        )
    }

    const counts = NIVEIS.reduce(
        (acc, n) => {
            acc[n.key] = avaliacoes.filter((a) => a.nivel === n.key).length
            return acc
        },
        {} as Record<AvaliacaoConservacao, number>,
    )

    return (
        <div className="space-y-3">
            {/* Barra horizontal */}
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                {NIVEIS.map((n) => {
                    const pct = (counts[n.key] / total) * 100
                    return pct > 0 ? (
                        <div
                            key={n.key}
                            className={classNames('h-full rounded-sm', n.color)}
                            style={{ width: `${pct}%` }}
                            title={`${n.label}: ${counts[n.key]}`}
                        />
                    ) : null
                })}
            </div>

            {/* Detalhamento */}
            <div className="space-y-1.5">
                {NIVEIS.map((n) => {
                    const count = counts[n.key]
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0
                    return (
                        <div key={n.key} className="flex items-center gap-2">
                            <span className="text-sm w-4">{n.icon}</span>
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={classNames('h-full rounded-full', n.color)}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-500 w-6 text-right">
                                {count}
                            </span>
                        </div>
                    )
                })}
            </div>

            <p className="text-xs text-gray-400 text-right">{total} avaliação{total !== 1 ? 'ões' : ''}</p>
        </div>
    )
}

export default EvaluationBar
