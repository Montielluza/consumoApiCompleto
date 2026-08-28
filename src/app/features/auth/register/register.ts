import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [RouterLink],
    template: `
        <h2>Crear cuenta</h2>
        <p class="placeholder-note">Formulario de registro disponible en el Avance 2.</p>
        <a routerLink="/auth/login">¿Ya tienes cuenta? Inicia sesión</a>
    `
})
export class Register {}