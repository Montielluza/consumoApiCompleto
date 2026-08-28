import { User } from './user.model';

/** Body de POST /api/auth/login. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Body de POST /api/auth/register (siempre crea un usuario con rol 'client'). */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Body de POST /api/auth/refresh y POST /api/auth/logout. */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * Respuesta de /auth/login, /auth/register y /auth/refresh.
 * El Swagger muestra que /auth/refresh a veces devuelve el "user" recortado
 * (solo id y role), por eso el resto de campos de User quedan opcionales.
 */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: Pick<User, 'id' | 'role'> & Partial<User>;
}

/** Respuesta de GET /api/auth/me. */
export interface MeResponse {
    user: User;
}