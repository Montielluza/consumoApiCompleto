import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [CommonModule, ConfirmDialog, Spinner],
    templateUrl: './profile-page.html',
    styleUrl: './profile-page.scss'
})
export class ProfilePage implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly user = signal<User | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);
    readonly showLogoutConfirm = signal(false);

    ngOnInit(): void {
        this.authService.fetchCurrentUser().subscribe({
        next: (user) => {
            this.user.set(user);
            this.isLoading.set(false);
        },
        error: () => {
            this.errorMessage.set('No se pudo cargar tu perfil.');
            this.isLoading.set(false);
        }
        });
    }

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