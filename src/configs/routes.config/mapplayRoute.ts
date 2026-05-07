import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const baseMeta = {
    pageContainerType: 'gutterless' as const,
    footer: false,
}

const mapplayRoute: Routes = [
    // Bottom nav
    { key: 'mapplay.mapa', path: '/mapa', component: lazy(() => import('@/views/mapplay/MapView')), authority: [ADMIN, USER], meta: baseMeta },
    { key: 'mapplay.explorar', path: '/explorar', component: lazy(() => import('@/views/mapplay/ExplorarView')), authority: [ADMIN, USER], meta: baseMeta },
    { key: 'mapplay.eventos', path: '/eventos', component: lazy(() => import('@/views/mapplay/EventosView')), authority: [ADMIN, USER], meta: baseMeta },
    { key: 'mapplay.perfil', path: '/perfil', component: lazy(() => import('@/views/mapplay/PerfilView')), authority: [ADMIN, USER], meta: baseMeta },

    // Espaços
    { key: 'mapplay.spaceRegister', path: '/espacos/novo', component: lazy(() => import('@/views/mapplay/SpaceRegister')), authority: [ADMIN, USER], meta: baseMeta },
    { key: 'mapplay.spaceDetail', path: '/espacos/:id', component: lazy(() => import('@/views/mapplay/SpaceDetail')), authority: [ADMIN, USER], meta: baseMeta },

    // Eventos — /eventos/novo antes de /evento/:id para evitar conflito
    { key: 'mapplay.eventCreate', path: '/eventos/novo', component: lazy(() => import('@/views/mapplay/EventCreate')), authority: [ADMIN, USER], meta: baseMeta },
    { key: 'mapplay.eventDetail', path: '/evento/:id', component: lazy(() => import('@/views/mapplay/EventDetail')), authority: [ADMIN, USER], meta: baseMeta },

    // Admin — acesso restrito verificado internamente no componente
    { key: 'mapplay.admin', path: '/admin', component: lazy(() => import('@/views/mapplay/AdminDashboard')), authority: [ADMIN, USER], meta: baseMeta },
]

export default mapplayRoute
