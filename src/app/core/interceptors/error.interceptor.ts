import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

/**
 * Manejo global de errores. NO reemplaza los mensajes inline que ya
 * muestran login/register/ticket-form/etc.; este interceptor solo
 * atrapa lo que ningún formulario puede prever: caída de red, errores
 * 5xx del servidor, o un 403 inesperado en medio de una acción.
 */
const SKIP_TOAST_ENDPOINTS = ['/auth/login', '/auth/register'];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
        const isAuthForm = SKIP_TOAST_ENDPOINTS.some((endpoint) => req.url.includes(endpoint));

        if (!isAuthForm) {
            if (error.status === 0) {
            notificationService.show('No se pudo conectar con el servidor. Verifica tu conexión.', 'danger');
            } else if (error.status >= 500) {
            notificationService.show('Ocurrió un error en el servidor. Inténtalo más tarde.', 'danger');
            } else if (error.status === 403) {
            notificationService.show('No tienes permisos para realizar esta acción.', 'danger');
            }
        }

        return throwError(() => error);
        })
    );
};