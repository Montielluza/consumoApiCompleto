import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import { User } from '../models/user.model';

/**
 * Único servicio autorizado a tocar localStorage para la sesión.
 * AuthService lo usa para persistir la sesión; los interceptores del
 * Avance 3 lo usarán para leer el access token en cada petición.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorageService {
    getAccessToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    getUser(): User | null {
        const raw = localStorage.getItem(STORAGE_KEYS.USER);
        if (!raw) {
        return null;
        }
        try {
        return JSON.parse(raw) as User;
        } catch {
        // Datos corruptos: se descartan en lugar de romper la app.
        return null;
        }
    }

    setSession(accessToken: string, refreshToken: string, user: User): void {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    setUser(user: User): void {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    clear(): void {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
}