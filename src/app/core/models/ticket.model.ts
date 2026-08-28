export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: TicketStatus;
    createdBy: string;
    assignedTo: string | null;
    createdAt: string;
    updatedAt: string;
}

/** Body de POST /api/tickets. */
export interface CreateTicketRequest {
    title: string;
    description: string;
    priority: Priority;
}

/**
 * Body de PATCH /api/tickets/:id.
 * admin puede enviar cualquiera de estos campos; agent solo priority/status.
 */
export interface UpdateTicketRequest {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: TicketStatus;
    }

    /** Body de POST /api/tickets/:id/assign. */
    export interface AssignTicketRequest {
    agentId: string;
    }

    /** "data" de la respuesta de POST /api/tickets/:id/assign (no es el Ticket completo). */
    export interface AssignTicketResponseData {
    id: string;
    assignedTo: string;
    status: TicketStatus;
}