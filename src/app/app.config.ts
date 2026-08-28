import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

/**
 * Configuración raíz de la app standalone.
 * NOTA: los interceptores (authInterceptor, refreshTokenInterceptor) se
 * añaden aquí en el Avance 3, dentro de provideHttpClient(withInterceptors([...])).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
};