import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [AsyncPipe],
    template: `
        <h2>Dashboard</h2>

        @if (authService.currentUser$ | async; as user) {
        <p>
            Sesión iniciada como <strong>{{ user.name }}</strong>
            ({{ user.role }})
        </p>
        <button type="button" class="btn--outline" (click)="logout()">Cerrar sesión</button>
        }

        <p class="placeholder-note">
        El contenido del dashboard, que varía según el rol (admin, agent, client),
        se implementa en el Avance 4.
        </p>
    `
})
export class DashboardPage {
    protected readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    logout(): void {
        this.authService.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
    }
}