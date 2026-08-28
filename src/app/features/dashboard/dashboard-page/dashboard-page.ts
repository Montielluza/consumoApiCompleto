import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    template: `
        <h2>Dashboard</h2>
        <p class="placeholder-note">
        El contenido del dashboard, que varía según el rol (admin, agent, client),
        se implementa en el Avance 4.
        </p>
    `
})
export class DashboardPage {}