import { useAuth } from '@/auth'
import { useSessionUser } from '@/store/authStore'
import { HiOutlineMapPin, HiOutlinePencil } from 'react-icons/hi2'

const SPORT_LABELS: Record<string, { label: string; emoji: string }> = {
    basquete: { label: 'Basquete', emoji: '🏀' },
    futebol: { label: 'Futebol', emoji: '⚽' },
    skate: { label: 'Skate', emoji: '🛹' },
}

const STATS = [
    { label: 'Espaços', value: '0' },
    { label: 'Eventos', value: '0' },
    { label: 'Mutirões', value: '0' },
]

const PerfilView = () => {
    const user = useSessionUser((state) => state.user)
    const { signOut } = useAuth()

    const initials = user.userName
        ? user.userName
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : '?'

    return (
        <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 pt-8 pb-6 px-6 text-center border-b border-gray-100 dark:border-gray-700">
                <div className="relative inline-block mb-4">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.userName ?? ''}
                            className="w-20 h-20 rounded-full object-cover mx-auto"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto">
                            <span className="text-white text-2xl font-bold">
                                {initials}
                            </span>
                        </div>
                    )}
                    <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 shadow-sm">
                        <HiOutlinePencil className="text-gray-500 text-sm" />
                    </button>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {user.userName ?? 'Usuário'}
                </h3>

                {(user.bairro || user.cidade) && (
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <HiOutlineMapPin className="text-base" />
                        <span>
                            {[user.bairro, user.cidade]
                                .filter(Boolean)
                                .join(', ')}
                        </span>
                    </div>
                )}

                {user.esportes && user.esportes.length > 0 && (
                    <div className="flex justify-center gap-2 flex-wrap">
                        {user.esportes.map((s) => {
                            const sport = SPORT_LABELS[s]
                            return sport ? (
                                <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                >
                                    {sport.emoji} {sport.label}
                                </span>
                            ) : null
                        })}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                {STATS.map((stat) => (
                    <div key={stat.label} className="py-4 text-center">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            <div className="px-4 py-6 space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center text-sm text-gray-400">
                    Histórico de atividades — disponível na Fase 4
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-full py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                    Sair da conta
                </button>
            </div>
        </div>
    )
}

export default PerfilView
