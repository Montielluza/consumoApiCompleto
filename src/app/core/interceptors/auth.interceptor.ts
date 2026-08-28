import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

/** Endpoints que NO necesitan el header Authorization. */
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

function isPublicEndpoint(url: string): boolean {
    return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
    }

    /**
     * Agrega automáticamente "Authorization: Bearer <token>" a toda petición
     * que no sea login/register/refresh (esas no necesitan el token porque
     * o todavía no existe, o el propio endpoint recibe el refreshToken en el body).
     */
    export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    if (isPublicEndpoint(req.url)) {
        return next(req);
    }

    const accessToken = authService.getAccessToken();

    if (!accessToken) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
    });

    return next(authReq);
};