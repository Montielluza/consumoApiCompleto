import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APP_CONFIG } from '../config/app.config.constant';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { RoleType, UserSummary } from '../models/user.model';
import { ApiListResponse } from '../../shared/interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = APP_CONFIG.apiUrl;

  /** GET /api/users, con filtro opcional por rol (usado para el selector de agentes). */
    getUsers(role?: RoleType): Observable<UserSummary[]> {
        let params = new HttpParams();
        if (role) {
        params = params.set('role', role);
        }
        return this.http
        .get<ApiListResponse<UserSummary>>(`${this.baseUrl}${API_ENDPOINTS.users.list}`, { params })
        .pipe(map((response) => response.data));
    }
}