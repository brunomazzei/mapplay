import { useNavigate } from 'react-router'
import { useAuth } from '@/auth'
import { useSessionUser } from '@/store/authStore'
import { useEspacoStore } from '@/store/espacoStore'
import { useEventoStore } from '@/store/eventoStore'
import { ADMIN } from '@/constants/roles.constant'
import { USUARIO_ATUAL } from '@/store/eventoStore'
import {
    HiOutlineMapPin,
    HiOutlinePencil,
    HiOutlineShieldCheck,
    HiOutlineChartBar,
} from 'react-icons/hi2'

const SPORT_LABELS: Record<string, { label: string; emoji: string }> = {
    basquete: { label: 'Basquete', emoji: '🏀' },
    futebol: { label: 'Futebol', emoji: '⚽' },
    skate: { label: 'Skate', emoji: '🛹' },
}

const PerfilView = () => {
    const navigate = useNavigate()
    const user = useSessionUser((state) => state.user)
    const { signOut } = useAuth()

    const espacosValidados = useEspacoStore((s) =>
        s.espacos.filter((e) => e.status === 'validado').length,
    )
    const eventosParticipando = useEventoStore((s) =>
        s.eventos.filter((e) => e.participantes.includes(USUARIO_ATUAL)).length,
    )
    const mutiroesParticipando = useEventoStore((s) =>
        s.eventos.filter(
            (e) => e.tipo === 'mutirao' && e.participantes.includes(USUARIO_ATUAL),
        ).length,
    )

    const isAdmin = user.authority?.includes(ADMIN)

    const initials = user.userName
        ? user.userName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'

    return (
        <div className="h-full overflow-y-auto bg-gray-50">
            {/* Hero do perfil */}
            <div className="bg-white pt-8 pb-6 px-6 text-center border-b border-gray-100">
                <div className="relative inline-block mb-4">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.userName ?? ''}
                            className="w-20 h-20 rounded-full object-cover mx-auto"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto">
                            <span className="text-white text-2xl font-bold">{initials}</span>
                        </div>
                    )}
                    <button className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
                        <HiOutlinePencil className="text-gray-500 text-sm" />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{user.userName ?? 'Usuário'}</h3>
                    {isAdmin && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            <HiOutlineShieldCheck className="text-xs" /> Admin
                        </span>
                    )}
                </div>

                {(user.bairro || user.cidade) && (
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-3">
                        <HiOutlineMapPin className="text-base" />
                        <span>{[user.bairro, user.cidade].filter(Boolean).join(', ')}</span>
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

            {/* Stats da comunidade */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white border-b border-gray-100">
                {[
                    { label: 'Espaços', value: espacosValidados },
                    { label: 'Eventos', value: eventosParticipando },
                    { label: 'Mutirões', value: mutiroesParticipando },
                ].map((stat) => (
                    <div key={stat.label} className="py-4 text-center">
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Ações */}
            <div className="px-4 py-5 space-y-3">
                {isAdmin && (
                    <button
                        onClick={() => navigate('/admin')}
                        className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 text-left"
                    >
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <HiOutlineChartBar className="text-primary text-lg" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Dashboard Admin</p>
                            <p className="text-xs text-gray-500">Estatísticas e exportação de dados</p>
                        </div>
                        <span className="text-gray-400 text-sm">→</span>
                    </button>
                )}

                <div className="bg-white rounded-2xl px-4 py-3.5 text-sm text-gray-400 text-center border border-gray-100">
                    Histórico de atividades — Fase 7 (Back4App)
                </div>

                <button
                    onClick={() => signOut()}
                    className="w-full py-3 rounded-2xl border border-red-200 text-red-500 text-sm font-medium"
                >
                    Sair da conta
                </button>
            </div>
        </div>
    )
}

export default PerfilView
