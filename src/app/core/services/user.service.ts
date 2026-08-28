import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { APP_CONFIG } from '../config/app.config.constant';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ChangeRoleResponseData, RoleType, UserSummary } from '../models/user.model';
import { ApiDataResponse, ApiListResponse } from '../../shared/interfaces/api-response.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = APP_CONFIG.apiUrl;

    getUsers(role?: RoleType): Observable<UserSummary[]> {
        let params = new HttpParams();
        if (role) {
        params = params.set('role', role);
        }
        return this.http
        .get<ApiListResponse<UserSummary>>(`${this.baseUrl}${API_ENDPOINTS.users.list}`, { params })
        .pipe(map((response) => response.data));
    }

    getUserById(id: string): Observable<UserSummary> {
        return this.http
        .get<ApiDataResponse<UserSummary>>(`${this.baseUrl}${API_ENDPOINTS.users.detail(id)}`)
        .pipe(map((response) => response.data));
    }

    changeRole(id: string, role: RoleType): Observable<ChangeRoleResponseData> {
        return this.http
        .patch<ApiDataResponse<ChangeRoleResponseData>>(
            `${this.baseUrl}${API_ENDPOINTS.users.changeRole(id)}`,
            { role }
        )
        .pipe(map((response) => response.data));
    }
}