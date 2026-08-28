import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Placeholder de la pantalla de Login.
 * El formulario reactivo y la conexión con AuthService.login()
 * se implementan en el Avance 2.
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    template: `
        <h2>Iniciar sesión</h2>
        <p class="placeholder-note">Formulario de login disponible en el Avance 2.</p>
        <a routerLink="/auth/register">¿No tienes cuenta? Regístrate</a>
    `
})
export class Login {}