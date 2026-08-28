import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';
import { ApiErrorResponse } from '../../../shared/interfaces/api-error.interface';

/**
 * Formulario de edición. La ruta ya está protegida con
 * roleGuard([ADMIN, AGENT]) (un client jamás llega aquí).
 *
 * - admin: puede editar title, description, priority y status de cualquier ticket.
 * - agent: solo puede editar priority y status, y solo si el ticket
 *   está asignado a él (el backend lo valida; aquí solo se muestra
 *   un aviso si no le pertenece, para no confundirlo).
 */
@Component({
    selector: 'app-ticket-edit',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './ticket-edit.html',
    styleUrl: './ticket-edit.scss'
})
export class TicketEdit implements OnChanges {
    @Input() id!: string;

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly ticketService = inject(TicketService);
    private readonly router = inject(Router);

    readonly ticket = signal<Ticket | null>(null);
    readonly isLoadingTicket = signal(true);
    readonly isSaving = signal(false);
    readonly loadErrorMessage = signal<string | null>(null);
    readonly saveErrorMessage = signal<string | null>(null);

    readonly isAdmin = this.authService.isAdmin();
    readonly isForbiddenForAgent = signal(false);

    readonly form = this.fb.nonNullable.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        priority: ['medium', [Validators.required]],
        status: ['open', [Validators.required]]
    });

    ngOnChanges(): void {
        if (!this.id) {
        return;
        }
        this.isLoadingTicket.set(true);
        this.loadErrorMessage.set(null);

        this.ticketService.getTicketById(this.id).subscribe({
        next: (ticket) => {
            this.ticket.set(ticket);
            this.form.patchValue({
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status
            });

            const currentUser = this.authService.currentUserValue;
            this.isForbiddenForAgent.set(!this.isAdmin && ticket.assignedTo !== currentUser?.id);

            this.isLoadingTicket.set(false);
        },
        error: () => {
            this.loadErrorMessage.set('No se pudo cargar el ticket.');
            this.isLoadingTicket.set(false);
        }
        });
    }

    submit(): void {
        this.saveErrorMessage.set(null);

        if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
        }

        this.isSaving.set(true);
        const { title, description, priority, status } = this.form.getRawValue();

        // agent solo puede modificar priority y status: aunque el form
        // tenga los otros campos, no se envían si no es admin.
        const payload = this.isAdmin ? { title, description, priority, status } : { priority, status };

        this.ticketService.updateTicket(this.id, payload).subscribe({
        next: () => {
            this.isSaving.set(false);
            this.router.navigate(['/tickets', this.id]);
        },
        error: (err: HttpErrorResponse) => {
            this.isSaving.set(false);
            const body = err.error as ApiErrorResponse | undefined;
            this.saveErrorMessage.set(body?.error?.message ?? 'No se pudo guardar el ticket. Inténtalo de nuevo.');
        }
        });
    }
}