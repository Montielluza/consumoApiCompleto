import { Component } from '@angular/core';

@Component({
    selector: 'app-ticket-list',
    standalone: true,
    template: `
        <h2>Tickets</h2>
        <p class="placeholder-note">
        Listado, filtros y paginación consumiendo GET /api/tickets se implementan en el Avance 4.
        </p>
    `
})
export class TicketList {}