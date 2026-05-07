import { NavLink } from 'react-router'
import {
    HiOutlineMap,
    HiOutlineSearch,
    HiOutlineCalendar,
    HiOutlineUser,
    HiMap,
    HiSearch,
    HiCalendar,
    HiUser,
} from 'react-icons/hi'

const navItems = [
    {
        path: '/mapa',
        label: 'Mapa',
        Icon: HiOutlineMap,
        IconActive: HiMap,
    },
    {
        path: '/explorar',
        label: 'Explorar',
        Icon: HiOutlineSearch,
        IconActive: HiSearch,
    },
    {
        path: '/eventos',
        label: 'Eventos',
        Icon: HiOutlineCalendar,
        IconActive: HiCalendar,
    },
    {
        path: '/perfil',
        label: 'Perfil',
        Icon: HiOutlineUser,
        IconActive: HiUser,
    },
]

const BottomNav = () => (
    <nav className="h-16 bg-white border-t border-gray-200 flex items-center shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {navItems.map(({ path, label, Icon, IconActive }) => (
            <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                    `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                        isActive ? 'text-primary' : 'text-gray-400'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        {isActive ? (
                            <IconActive className="text-2xl" />
                        ) : (
                            <Icon className="text-2xl" />
                        )}
                        <span>{label}</span>
                    </>
                )}
            </NavLink>
        ))}
    </nav>
)

export default BottomNav
