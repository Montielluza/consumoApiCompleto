import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ROLES } from './core/constants/roles.constant';

/**
 * Rutas raíz de la aplicación.
 * - "auth" usa AuthLayout (pantalla centrada, sin sidebar/navbar).
 * - El resto usa MainLayout, protegido con authGuard vía canActivateChild:
 *   nadie entra a dashboard/tickets/users/profile sin sesión.
 * - "users" además exige rol admin con roleGuard.
 */
export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () =>
        import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadComponent: () =>
        import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
        canActivateChild: [authGuard],
        children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        {
            path: 'dashboard',
            loadChildren: () =>
            import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
        },
        {
            path: 'tickets',
            loadChildren: () =>
            import('./features/tickets/tickets.routes').then((m) => m.TICKETS_ROUTES)
        },
        {
            path: 'users',
            canActivate: [roleGuard([ROLES.ADMIN])],
            loadChildren: () =>
            import('./features/users/users.routes').then((m) => m.USERS_ROUTES)
        },
        {
            path: 'profile',
            loadChildren: () =>
            import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES)
        }
        ]
    },
    {
        path: 'not-found',
        loadComponent: () =>
        import('./features/not-found/not-found').then((m) => m.NotFound)
    },
    { path: '**', redirectTo: 'not-found' }
];