import { RoleType } from './user.model';

export interface CommentAuthor {
    id: string;
    name: string;
    role: RoleType;
}

export interface Comment {
    id: string;
    ticketId: string;
    authorId: string;
    body: string;
    createdAt: string;
  /** Puede ser null si el autor original ya no existe. */
    author: CommentAuthor | null;
}

/** Body de POST /api/tickets/:id/comments. */
export interface CreateCommentRequest {
    body: string;
}