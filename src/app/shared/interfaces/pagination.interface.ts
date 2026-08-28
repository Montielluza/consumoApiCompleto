import { Priority, TicketStatus } from '../../core/models/ticket.model';

/** meta de TicketListResponse. */
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/** Query params soportados por GET /api/tickets. */
export interface TicketFilters {
    status?: TicketStatus;
    priority?: Priority;
    page?: number;
    limit?: number;
}