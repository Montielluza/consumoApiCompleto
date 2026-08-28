import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

/**
 * Detalle de un ticket. El "id" llega automáticamente desde la URL
 * gracias a withComponentInputBinding() (configurado en app.config.ts).
 *
 * El historial de comentarios y la posibilidad de agregar uno nuevo
 * se implementan en el Avance 5.
 */
@Component({
    selector: 'app-ticket-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './ticket-detail.html',
    styleUrl: './ticket-detail.scss'
})
export class TicketDetail implements OnChanges {
    @Input() id!: string;

    private readonly ticketService = inject(TicketService);

    readonly ticket = signal<Ticket | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);

    ngOnChanges(): void {
        if (!this.id) {
        return;
        }
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.ticketService.getTicketById(this.id).subscribe({
        next: (ticket) => {
            this.ticket.set(ticket);
            this.isLoading.set(false);
        },
        error: () => {
            this.errorMessage.set('No se pudo cargar el ticket. Puede que no exista o no tengas acceso.');
            this.isLoading.set(false);
        }
        });
    }
}