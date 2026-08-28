import { Component } from '@angular/core';

@Component({
    selector: 'app-user-list',
    standalone: true,
    template: `
        <h2>Usuarios</h2>
        <p class="placeholder-note">Listado y cambio de rol (solo admin) se implementan en el Avance 6.</p>
    `
})
export class UserList {}