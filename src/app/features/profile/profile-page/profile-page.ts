import { Component } from '@angular/core';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    template: `
        <h2>Mi perfil</h2>
        <p class="placeholder-note">Datos de GET /api/auth/me y logout se implementan en el Avance 6.</p>
    `
})
export class ProfilePage {}
