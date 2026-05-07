import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const baseMeta = {
    pageContainerType: 'gutterless' as const,
    footer: false,
}

const mapplayRoute: Routes = [
    {
        key: 'mapplay.mapa',
        path: '/mapa',
        component: lazy(() => import('@/views/mapplay/MapView')),
        authority: [ADMIN, USER],
        meta: baseMeta,
    },
    {
        key: 'mapplay.explorar',
        path: '/explorar',
        component: lazy(() => import('@/views/mapplay/ExplorarView')),
        authority: [ADMIN, USER],
        meta: baseMeta,
    },
    {
        key: 'mapplay.eventos',
        path: '/eventos',
        component: lazy(() => import('@/views/mapplay/EventosView')),
        authority: [ADMIN, USER],
        meta: baseMeta,
    },
    {
        key: 'mapplay.perfil',
        path: '/perfil',
        component: lazy(() => import('@/views/mapplay/PerfilView')),
        authority: [ADMIN, USER],
        meta: baseMeta,
    },
    {
        key: 'mapplay.spaceRegister',
        path: '/espacos/novo',
        component: lazy(() => import('@/views/mapplay/SpaceRegister')),
        authority: [ADMIN, USER],
        meta: baseMeta,
    },
    {
        key: 'mapplay.spaceDetail',
        path: '/espacos/:id',
        component: lazy(() => import('@/views/mapplay/SpaceDetail')),
        authority: [ADMIN, USER],
        meta: baseMeta,
    },
]

export default mapplayRoute
