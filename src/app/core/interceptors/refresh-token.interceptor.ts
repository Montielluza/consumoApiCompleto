import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { ApiErrorResponse } from '../../shared/interfaces/api-error.interface';

/**
 * Endpoints donde un 401 NO significa "token vencido" sino
 * "credenciales/; refresh inválido". Ahí no tiene sentido intentar renovar.
 */
const SKIP_REFRESH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh'];

// Estado compartido a nivel de módulo: como los interceptores funcionales
// son un singleton (el módulo se importa una sola vez), estas variables
// sirven para "serializar" el refresh entre peticiones simultáneas.
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    /**
     * Renueva automáticamente el access token cuando la API responde
     * 401 TOKEN_EXPIRED, y reintenta la petición original con el token nuevo.
     *
     * Si varias peticiones fallan con 401 al mismo tiempo, solo la primera
     * dispara /auth/refresh; el resto espera (vía refreshTokenSubject) a que
     * termine esa renovación y reintenta con el token que ella obtuvo.
     */
    export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (SKIP_REFRESH_ENDPOINTS.some((endpoint) => req.url.includes(endpoint))) {
        return next(req);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
        const body = error.error as ApiErrorResponse | undefined;
        const isTokenExpired = error.status === 401 && body?.error?.code === 'TOKEN_EXPIRED';

        if (!isTokenExpired) {
            return throwError(() => error);
        }

        if (!isRefreshing) {
            isRefreshing = true;
            refreshTokenSubject.next(null);

            return authService.refreshToken().pipe(
            switchMap((response) => {
                isRefreshing = false;
                refreshTokenSubject.next(response.accessToken);
                return next(addToken(req, response.accessToken));
            }),
            catchError((refreshError) => {
                isRefreshing = false;
                authService.logout().subscribe();
                router.navigateByUrl('/auth/login');
                return throwError(() => refreshError);
            })
            );
        }

        // Ya hay un refresh en curso: esperamos a que termine y reintentamos.
        return refreshTokenSubject.pipe(
            filter((token): token is string => token !== null),
            take(1),
            switchMap((token) => next(addToken(req, token)))
        );
        })
    );
};