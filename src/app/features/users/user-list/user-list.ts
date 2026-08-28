import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RoleType, UserSummary } from '../../../core/models/user.model';
import { ApiErrorResponse } from '../../../shared/interfaces/api-error.interface';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, EmptyState, Spinner],
    templateUrl: './user-list.html',
    styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
    private readonly userService = inject(UserService);
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);

    readonly users = signal<UserSummary[]>([]);
    readonly isLoading = signal(true);
    readonly roleFilter = signal<RoleType | ''>('');
    readonly savingUserId = signal<string | null>(null);

    ngOnInit(): void {
        this.loadUsers();
    }

    onFilterChange(value: string): void {
        this.roleFilter.set(value as RoleType | '');
        this.loadUsers();
    }

    onRoleSelectChange(user: UserSummary, value: string): void {
        this.changeRole(user, value as RoleType);
    }

    private loadUsers(): void {
        this.isLoading.set(true);
        this.userService.getUsers(this.roleFilter() || undefined).subscribe({
        next: (users) => {
            this.users.set(users);
            this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
        });
    }

    private changeRole(user: UserSummary, newRole: RoleType): void {
        if (newRole === user.role) {
        return;
        }

        const currentUser = this.authService.currentUserValue;
        if (user.id === currentUser?.id && user.role === 'admin' && newRole !== 'admin') {
        this.notificationService.show('No puedes quitarte tu propio rol de administrador.', 'danger');
        return;
        }

        this.savingUserId.set(user.id);

        this.userService.changeRole(user.id, newRole).subscribe({
        next: (updated) => {
            this.users.update((list) =>
            list.map((u) => (u.id === updated.id ? { ...u, role: updated.role } : u))
            );
            this.savingUserId.set(null);
            this.notificationService.show('Rol actualizado correctamente.', 'success');
        },
        error: (err: HttpErrorResponse) => {
            this.savingUserId.set(null);
            const body = err.error as ApiErrorResponse | undefined;
            this.notificationService.show(body?.error?.message ?? 'No se pudo cambiar el rol.', 'danger');
        }
        });
    }
}