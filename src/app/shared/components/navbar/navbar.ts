import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [AsyncPipe, RouterLink, ConfirmDialog],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss'
})
export class Navbar {
    protected readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly showLogoutConfirm = signal(false);

    requestLogout(): void {
        this.showLogoutConfirm.set(true);
    }

    confirmLogout(): void {
        this.showLogoutConfirm.set(false);
        this.authService.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
    }

    cancelLogout(): void {
        this.showLogoutConfirm.set(false);
    }
}