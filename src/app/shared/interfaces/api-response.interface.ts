import { PaginationMeta } from './pagination.interface';

/** Respuesta con un solo recurso envuelto en "data" (tickets, comentarios, usuarios). */
export interface ApiDataResponse<T> {
    data: T;
    message?: string;
}

/** Respuesta con una lista simple envuelta en "data" + "total" (comentarios, usuarios). */
export interface ApiListResponse<T> {
    data: T[];
    total: number;
}

/** Respuesta paginada de GET /api/tickets. */
export interface ApiPaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/** Respuesta genérica de solo mensaje (logout, delete). */
export interface MessageResponse {
    message: string;
}