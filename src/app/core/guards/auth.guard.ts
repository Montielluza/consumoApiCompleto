import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Impide el acceso a rutas protegidas si no hay una sesión válida.
 * Si no hay sesión, redirige a /auth/login y guarda la URL original
 * en returnUrl para poder volver a ella después de iniciar sesión.
 */
export const authGuard: CanActivateFn = (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
};