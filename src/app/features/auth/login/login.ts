import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { ApiErrorResponse } from '../../../shared/interfaces/api-error.interface';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.scss'
    })
    export class Login {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    get email() {
        return this.form.controls.email;
    }

    get password() {
        return this.form.controls.password;
    }

    submit(): void {
        this.errorMessage.set(null);

        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.isLoading.set(true);

        this.authService.login(this.form.getRawValue()).subscribe({
        next: () => {
            this.isLoading.set(false);
            this.router.navigateByUrl('/dashboard');
        },
        error: (err: HttpErrorResponse) => {
            this.isLoading.set(false);
            this.errorMessage.set(this.extractErrorMessage(err));
        }
        });
    }

    private extractErrorMessage(err: HttpErrorResponse): string {
        const body = err.error as ApiErrorResponse | undefined;
        if (body?.error?.message) {
        return body.error.message;
        }
        if (err.status === 401) {
        return 'Email o contraseña incorrectos.';
        }
        return 'No se pudo iniciar sesión. Inténtalo de nuevo.';
    }
}