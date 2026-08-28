import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';

interface DashboardStats {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
}

/**
 * Dashboard. El backend ya filtra los tickets según el rol autenticado
 * (admin: todos, agent: asignados + sin asignar, client: solo los suyos),
 * así que este componente es el mismo para los 3 roles: solo pide
 * conteos por estado y los muestra.
 */
@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './dashboard-page.html',
    styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
    protected readonly authService = inject(AuthService);
    private readonly ticketService = inject(TicketService);
    private readonly router = inject(Router);

    readonly stats = signal<DashboardStats | null>(null);
    readonly isLoadingStats = signal(true);

    ngOnInit(): void {
        // limit: 1 porque solo nos interesa "meta.total" de cada consulta,
        // no necesitamos traer los tickets completos para contar.
        forkJoin({
        total: this.ticketService.getTickets({ limit: 1 }),
        open: this.ticketService.getTickets({ status: 'open', limit: 1 }),
        inProgress: this.ticketService.getTickets({ status: 'in_progress', limit: 1 }),
        resolved: this.ticketService.getTickets({ status: 'resolved', limit: 1 }),
        closed: this.ticketService.getTickets({ status: 'closed', limit: 1 })
        }).subscribe({
        next: (res) => {
            this.stats.set({
            total: res.total.meta.total,
            open: res.open.meta.total,
            inProgress: res.inProgress.meta.total,
            resolved: res.resolved.meta.total,
            closed: res.closed.meta.total
            });
            this.isLoadingStats.set(false);
        },
        error: () => this.isLoadingStats.set(false)
        });
    }

    logout(): void {
        this.authService.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
    }
}