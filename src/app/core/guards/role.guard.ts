import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { RoleType } from '../models/user.model';

/**
 * Restringe una ruta a uno o más roles específicos.
 * Uso en las rutas: canActivate: [roleGuard([ROLES.ADMIN])]
 *
 * - Si no hay sesión, redirige a /auth/login (igual que authGuard).
 * - Si hay sesión pero el rol no es el permitido, redirige a /dashboard
 *   en lugar de mostrar una pantalla en blanco o un error.
 */
export function roleGuard(allowedRoles: RoleType[]): CanActivateFn {
    return (_route, state) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (!authService.isAuthenticated()) {
        return router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
        });
        }

        if (authService.hasRole(...allowedRoles)) {
        return true;
        }

        return router.createUrlTree(['/dashboard']);
    };
}