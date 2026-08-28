import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APP_CONFIG } from '../config/app.config.constant';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { ApiDataResponse, ApiListResponse } from '../../shared/interfaces/api-response.interface';

/**
 * Centraliza la comunicación con /api/tickets/:id/comments.
 * Quién lo usa: TicketDetail (listar y crear comentarios).
 */
@Injectable({ providedIn: 'root' })
export class CommentService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = APP_CONFIG.apiUrl;

    getComments(ticketId: string): Observable<Comment[]> {
        return this.http
        .get<ApiListResponse<Comment>>(`${this.baseUrl}${API_ENDPOINTS.tickets.comments(ticketId)}`)
        .pipe(map((response) => response.data));
    }

    /** No se puede comentar un ticket cerrado (el backend lo rechaza con 400). */
    addComment(ticketId: string, payload: CreateCommentRequest): Observable<Comment> {
        return this.http
        .post<ApiDataResponse<Comment>>(`${this.baseUrl}${API_ENDPOINTS.tickets.comments(ticketId)}`, payload)
        .pipe(map((response) => response.data));
    }
}