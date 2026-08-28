import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';
import { PaginationMeta } from '../../../shared/interfaces/pagination.interface';
import { ROLES } from '../../../core/constants/roles.constant';

const PAGE_SIZE = 10;

@Component({
    selector: 'app-ticket-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './ticket-list.html',
    styleUrl: './ticket-list.scss'
    })
    export class TicketList implements OnInit {
    private readonly ticketService = inject(TicketService);
    private readonly authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);

    readonly filtersForm = this.fb.nonNullable.group({
        status: [''],
        priority: [''],
        search: ['']
    });

    readonly tickets = signal<Ticket[]>([]);
    readonly meta = signal<PaginationMeta | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);
    readonly page = signal(1);

    /** admin y client pueden crear tickets; agent no (lo rechaza el backend). */
    readonly canCreateTicket = this.authService.hasRole(ROLES.ADMIN, ROLES.CLIENT);

    readonly filteredTickets = computed(() => {
        const term = this.filtersForm.controls.search.value.trim().toLowerCase();
        if (!term) {
        return this.tickets();
        }
        return this.tickets().filter((t) => t.title.toLowerCase().includes(term));
    });

    ngOnInit(): void {
        this.loadTickets();

        this.filtersForm.controls.status.valueChanges.subscribe(() => this.applyFilters());
        this.filtersForm.controls.priority.valueChanges.subscribe(() => this.applyFilters());
    }

    private applyFilters(): void {
        this.page.set(1);
        this.loadTickets();
    }

    private loadTickets(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        const { status, priority } = this.filtersForm.getRawValue();

        this.ticketService
        .getTickets({
            status: (status || undefined) as Ticket['status'] | undefined,
            priority: (priority || undefined) as Ticket['priority'] | undefined,
            page: this.page(),
            limit: PAGE_SIZE
        })
        .subscribe({
            next: (response) => {
            this.tickets.set(response.data);
            this.meta.set(response.meta);
            this.isLoading.set(false);
            },
            error: () => {
            this.errorMessage.set('No se pudieron cargar los tickets. Inténtalo de nuevo.');
            this.isLoading.set(false);
            }
        });
    }

    goToPage(newPage: number): void {
        const totalPages = this.meta()?.totalPages ?? 1;
        if (newPage < 1 || newPage > totalPages) {
        return;
        }
        this.page.set(newPage);
        this.loadTickets();
    }
}