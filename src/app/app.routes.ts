import { Routes } from '@angular/router';

/**
 * Rutas raíz de la aplicación.
 * - "auth" usa AuthLayout (pantalla centrada, sin sidebar/navbar).
 * - El resto usa MainLayout (navbar + sidebar) y en el Avance 3
 *   quedarán protegidas por AuthGuard / RoleGuard.
 * Todo el contenido de features se carga de forma diferida (lazy loading).
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