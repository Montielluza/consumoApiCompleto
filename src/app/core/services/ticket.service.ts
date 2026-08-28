import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APP_CONFIG } from '../config/app.config.constant';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { Ticket } from '../models/ticket.model';
import { ApiDataResponse, ApiPaginatedResponse } from '../../shared/interfaces/api-response.interface';
import { TicketFilters } from '../../shared/interfaces/pagination.interface';

/**
 * Centraliza toda la comunicación con /api/tickets.
 * Por ahora solo lectura (getTickets, getTicketById); create/update/
 * remove/assign se agregan en el Avance 5.
 *
 * Quién lo usa: DashboardPage (estadísticas), TicketList, TicketDetail.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = APP_CONFIG.apiUrl;

    /**
     * GET /api/tickets. El backend ya filtra por rol automáticamente
     * (admin ve todos, agent ve asignados + sin asignar, client ve los suyos),
     * así que el frontend no necesita replicar esa lógica.
     */
    getTickets(filters: TicketFilters = {}): Observable<ApiPaginatedResponse<Ticket>> {
        let params = new HttpParams()
        .set('page', String(filters.page ?? 1))
        .set('limit', String(filters.limit ?? 10));

        if (filters.status) {
        params = params.set('status', filters.status);
        }
        if (filters.priority) {
        params = params.set('priority', filters.priority);
        }

        return this.http.get<ApiPaginatedResponse<Ticket>>(
        `${this.baseUrl}${API_ENDPOINTS.tickets.list}`,
        { params }
        );
    }

    /** GET /api/tickets/:id */
    getTicketById(id: string): Observable<Ticket> {
        return this.http
        .get<ApiDataResponse<Ticket>>(`${this.baseUrl}${API_ENDPOINTS.tickets.detail(id)}`)
        .pipe(map((response) => response.data));
    }
}