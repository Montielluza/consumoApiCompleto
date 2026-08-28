import { ROLES } from '../constants/roles.constant';

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export interface User {
    id: string;
    name: string;
    email: string;
    role: RoleType;
    createdAt: string;
}

export interface UserSummary {
    id: string;
    name: string;
    role: RoleType;
    }

/** "data" de la respuesta de PATCH /api/users/:id/role (no trae "name"). */
export interface ChangeRoleResponseData {
    id: string;
    role: RoleType;
}