import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APP_CONFIG } from '../config/app.config.constant';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import {
    AssignTicketRequest,
    AssignTicketResponseData,
    CreateTicketRequest,
    Ticket,
    UpdateTicketRequest
} from '../models/ticket.model';
import {
    ApiDataResponse,
    ApiPaginatedResponse,
    MessageResponse
} from '../../shared/interfaces/api-response.interface';
import { TicketFilters } from '../../shared/interfaces/pagination.interface';

/**
 * Centraliza toda la comunicación con /api/tickets.
 * Quién lo usa: DashboardPage, TicketList, TicketDetail, TicketForm, TicketEdit.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = APP_CONFIG.apiUrl;

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

    getTicketById(id: string): Observable<Ticket> {
        return this.http
        .get<ApiDataResponse<Ticket>>(`${this.baseUrl}${API_ENDPOINTS.tickets.detail(id)}`)
        .pipe(map((response) => response.data));
    }

    /** POST /api/tickets. Disponible para admin y client (el backend rechaza a agent). */
    createTicket(payload: CreateTicketRequest): Observable<Ticket> {
        return this.http
        .post<ApiDataResponse<Ticket>>(`${this.baseUrl}${API_ENDPOINTS.tickets.create}`, payload)
        .pipe(map((response) => response.data));
    }

    /**
     * PATCH /api/tickets/:id. admin puede enviar cualquier campo;
     * agent solo priority/status (el formulario ya restringe esto,
     * pero el backend es la fuente de verdad final).
     */
    updateTicket(id: string, payload: UpdateTicketRequest): Observable<Ticket> {
        return this.http
        .patch<ApiDataResponse<Ticket>>(`${this.baseUrl}${API_ENDPOINTS.tickets.update(id)}`, payload)
        .pipe(map((response) => response.data));
    }

    /** DELETE /api/tickets/:id. Solo admin. */
    deleteTicket(id: string): Observable<MessageResponse> {
        return this.http.delete<MessageResponse>(`${this.baseUrl}${API_ENDPOINTS.tickets.remove(id)}`);
    }

    /** POST /api/tickets/:id/assign. Solo admin. */
    assignTicket(id: string, payload: AssignTicketRequest): Observable<AssignTicketResponseData> {
        return this.http
        .post<ApiDataResponse<AssignTicketResponseData>>(
            `${this.baseUrl}${API_ENDPOINTS.tickets.assign(id)}`,
            payload
        )
        .pipe(map((response) => response.data));
    }
}