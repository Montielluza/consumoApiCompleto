import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, of, finalize } from 'rxjs';

import { APP_CONFIG } from '../config/app.config.constant';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ROLES } from '../constants/roles.constant';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse, LoginRequest, MeResponse, RegisterRequest } from '../models/auth.model';
import { RoleType, User } from '../models/user.model';
import { MessageResponse } from '../../shared/interfaces/api-response.interface';

/**
 * AuthService: único punto de la app que sabe cómo iniciar sesión,
 * registrarse, cerrar sesión, renovar tokens y exponer quién es el
 * usuario autenticado en este momento.
 *
 * Quién lo utiliza: Login, Register, AuthGuard/RoleGuard (Avance 3),
 * el interceptor de refresh (Avance 3), Navbar/Profile (Avance 6).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenStorage = inject(TokenStorageService);

    private readonly baseUrl = APP_CONFIG.apiUrl;

    /** Estado reactivo del usuario autenticado (null si no hay sesión). */
    private readonly currentUserSubject = new BehaviorSubject<User | null>(
        this.tokenStorage.getUser()
    );
    readonly currentUser$ = this.currentUserSubject.asObservable();

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http
        .post<AuthResponse>(`${this.baseUrl}${API_ENDPOINTS.auth.login}`, credentials)
        .pipe(tap((response) => this.persistSession(response)));
    }

    register(payload: RegisterRequest): Observable<AuthResponse> {
        return this.http
        .post<AuthResponse>(`${this.baseUrl}${API_ENDPOINTS.auth.register}`, payload)
        .pipe(tap((response) => this.persistSession(response)));
    }

    /**
     * Intercambia el refresh token actual por un nuevo par de tokens.
     * Lo usa principalmente el interceptor de renovación (Avance 3),
     * pero también puede llamarse manualmente si se necesita.
     */
    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.tokenStorage.getRefreshToken();
        return this.http
        .post<AuthResponse>(`${this.baseUrl}${API_ENDPOINTS.auth.refresh}`, { refreshToken })
        .pipe(
            tap((response) => {
            // La respuesta de /refresh puede traer el "user" recortado
            // (solo id y role), así que se fusiona con el usuario ya guardado.
            const mergedUser: User = {
                ...(this.currentUserValue as User),
                ...response.user
            } as User;
            this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
            this.tokenStorage.setUser(mergedUser);
            this.currentUserSubject.next(mergedUser);
            })
        );
    }

    /**
     * Cierra sesión: invalida el refresh token en el servidor y, pase lo
     * que pase con esa llamada, limpia la sesión local (localStorage +
     * BehaviorSubject) para que el usuario nunca quede "atascado" logueado.
     */
    logout(): Observable<MessageResponse | null> {
        const refreshToken = this.tokenStorage.getRefreshToken();

        if (!refreshToken) {
        this.clearSession();
        return of(null);
        }

        return this.http
        .post<MessageResponse>(`${this.baseUrl}${API_ENDPOINTS.auth.logout}`, { refreshToken })
        .pipe(
            catchError(() => of(null)),
            finalize(() => this.clearSession())
        );
    }

    /** Consulta /auth/me y actualiza el usuario en memoria y en localStorage. */
    fetchCurrentUser(): Observable<User> {
        return this.http.get<MeResponse>(`${this.baseUrl}${API_ENDPOINTS.auth.me}`).pipe(
        map((response) => response.user),
        tap((user) => {
            this.tokenStorage.setUser(user);
            this.currentUserSubject.next(user);
        })
        );
    }

    getAccessToken(): string | null {
        return this.tokenStorage.getAccessToken();
    }

    getRefreshToken(): string | null {
        return this.tokenStorage.getRefreshToken();
    }

    isAuthenticated(): boolean {
        return !!this.tokenStorage.getAccessToken() && !!this.currentUserValue;
    }

    /** true si el usuario autenticado tiene alguno de los roles indicados. */
    hasRole(...roles: RoleType[]): boolean {
        const current = this.currentUserValue;
        return !!current && roles.includes(current.role);
    }

    isAdmin(): boolean {
        return this.hasRole(ROLES.ADMIN);
    }

    private persistSession(response: AuthResponse): void {
        const user = response.user as User;
        this.tokenStorage.setSession(response.accessToken, response.refreshToken, user);
        this.currentUserSubject.next(user);
    }

    private clearSession(): void {
        this.tokenStorage.clear();
        this.currentUserSubject.next(null);
    }
}