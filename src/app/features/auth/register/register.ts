import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { ApiErrorResponse } from '../../../shared/interfaces/api-error.interface';

/** Validador a nivel de grupo: confirmPassword debe ser igual a password. */
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.scss'
})
export class Register {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.fb.nonNullable.group(
        {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
        },
        { validators: passwordsMatchValidator }
    );

    get name() {
        return this.form.controls.name;
    }

    get email() {
        return this.form.controls.email;
    }

    get password() {
        return this.form.controls.password;
    }

    get confirmPassword() {
        return this.form.controls.confirmPassword;
    }

    submit(): void {
        this.errorMessage.set(null);

        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.isLoading.set(true);
        const { name, email, password } = this.form.getRawValue();

        this.authService.register({ name, email, password }).subscribe({
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
        if (err.status === 409) {
        return 'El correo ya está en uso.';
        }
        return 'No se pudo completar el registro. Inténtalo de nuevo.';
    }
}