import authRoute from './authRoute'
import mapplayRoute from './mapplayRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [...mapplayRoute]
