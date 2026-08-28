import { environment } from '../../../environments/environment';

/**
 * Punto único de acceso a la configuración del entorno.
 * Ningún otro archivo debe importar "environment" directamente.
 */
export const APP_CONFIG = {
    apiUrl: environment.apiUrl,
    production: environment.production,
    accessTokenExpirationMinutes: 15,
    refreshTokenExpirationDays: 7
};