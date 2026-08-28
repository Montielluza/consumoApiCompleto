import { ROLES } from '../constants/roles.constant';

/** Alias de tipo para poder usar 'admin' | 'agent' | 'client' como tipo. */
export type RoleType = (typeof ROLES)[keyof typeof ROLES];

/**
 * Usuario completo, tal como lo devuelven /auth/login, /auth/register
 * y /auth/me.
 */
export interface User {
    id: string;
    name: string;
    email: string;
    role: RoleType;
    createdAt: string;
}

/*Versión reducida de usuario, tal como la devuelve GET /api/users
 * y GET /api/users/:id (sin email ni createdAt).
 */
export interface UserSummary {
    id: string;
    name: string;
    role: RoleType;
}