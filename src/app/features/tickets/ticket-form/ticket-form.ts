import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TicketService } from '../../../core/services/ticket.service';
import { ApiErrorResponse } from '../../../shared/interfaces/api-error.interface';

@Component({
    selector: 'app-ticket-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './ticket-form.html',
    styleUrl: './ticket-form.scss'
    })
    export class TicketForm {
    private readonly fb = inject(FormBuilder);
    private readonly ticketService = inject(TicketService);
    private readonly router = inject(Router);

    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        priority: ['medium', [Validators.required]]
    });

    get title() {
        return this.form.controls.title;
    }

    get description() {
        return this.form.controls.description;
    }

    submit(): void {
        this.errorMessage.set(null);

        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.isLoading.set(true);

        this.ticketService.createTicket(this.form.getRawValue()).subscribe({
        next: (ticket) => {
            this.isLoading.set(false);
            this.router.navigate(['/tickets', ticket.id]);
        },
        error: (err: HttpErrorResponse) => {
            this.isLoading.set(false);
            const body = err.error as ApiErrorResponse | undefined;
            this.errorMessage.set(
            body?.error?.message ?? 'No se pudo crear el ticket. Verifica los datos e inténtalo de nuevo.'
            );
        }
        });
    }
}