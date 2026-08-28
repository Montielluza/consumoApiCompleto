import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { TicketService } from '../../../core/services/ticket.service';
import { CommentService } from '../../../core/services/comment.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Ticket } from '../../../core/models/ticket.model';
import { Comment } from '../../../core/models/comment.model';
import { UserSummary } from '../../../core/models/user.model';
import { ROLES } from '../../../core/constants/roles.constant';
import { ApiErrorResponse } from '../../../shared/interfaces/api-error.interface';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
    selector: 'app-ticket-detail',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, ConfirmDialog, EmptyState],
    templateUrl: './ticket-detail.html',
    styleUrl: './ticket-detail.scss'
})
export class TicketDetail implements OnChanges {
    @Input() id!: string;

    private readonly fb = inject(FormBuilder);
    private readonly ticketService = inject(TicketService);
    private readonly commentService = inject(CommentService);
    private readonly userService = inject(UserService);
    protected readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);

    readonly ticket = signal<Ticket | null>(null);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);

    readonly comments = signal<Comment[]>([]);
    readonly isLoadingComments = signal(true);

    readonly commentForm = this.fb.nonNullable.group({
        body: ['', [Validators.required, Validators.minLength(3)]]
    });
    readonly isSendingComment = signal(false);
    readonly commentErrorMessage = signal<string | null>(null);

    readonly agents = signal<UserSummary[]>([]);
    readonly assignForm = this.fb.nonNullable.group({
        agentId: ['', [Validators.required]]
    });
    readonly isAssigning = signal(false);
    readonly assignErrorMessage = signal<string | null>(null);

    readonly isDeleting = signal(false);
    readonly showDeleteConfirm = signal(false);

    get canEdit(): boolean {
        const t = this.ticket();
        if (!t) {
        return false;
        }
        if (this.authService.isAdmin()) {
        return true;
        }
        const currentUser = this.authService.currentUserValue;
        return this.authService.hasRole(ROLES.AGENT) && t.assignedTo === currentUser?.id;
    }

    get canDelete(): boolean {
        return this.authService.isAdmin();
    }

    get canAssign(): boolean {
        return this.authService.isAdmin();
    }

    get isTicketClosed(): boolean {
        return this.ticket()?.status === 'closed';
    }

    ngOnChanges(): void {
        if (!this.id) {
        return;
        }
        this.loadTicket();
        this.loadComments();

        if (this.authService.isAdmin()) {
        this.userService.getUsers(ROLES.AGENT).subscribe((agents) => this.agents.set(agents));
        }
    }

    private loadTicket(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.ticketService.getTicketById(this.id).subscribe({
        next: (ticket) => {
            this.ticket.set(ticket);
            this.isLoading.set(false);
        },
        error: () => {
            this.errorMessage.set('No se pudo cargar el ticket. Puede que no exista o no tengas acceso.');
            this.isLoading.set(false);
        }
        });
    }

    private loadComments(): void {
        this.isLoadingComments.set(true);
        this.commentService.getComments(this.id).subscribe({
        next: (comments) => {
            this.comments.set(comments);
            this.isLoadingComments.set(false);
        },
        error: () => this.isLoadingComments.set(false)
        });
    }

    submitComment(): void {
        this.commentErrorMessage.set(null);

        if (this.commentForm.invalid) {
        this.commentForm.markAllAsTouched();
        return;
        }

        this.isSendingComment.set(true);

        this.commentService.addComment(this.id, this.commentForm.getRawValue()).subscribe({
        next: (comment) => {
            this.comments.update((list) => [...list, comment]);
            this.commentForm.reset({ body: '' });
            this.isSendingComment.set(false);
        },
        error: (err: HttpErrorResponse) => {
            this.isSendingComment.set(false);
            const body = err.error as ApiErrorResponse | undefined;
            this.commentErrorMessage.set(body?.error?.message ?? 'No se pudo agregar el comentario.');
        }
        });
    }

    submitAssign(): void {
        this.assignErrorMessage.set(null);

        if (this.assignForm.invalid) {
        this.assignForm.markAllAsTouched();
        return;
        }

        this.isAssigning.set(true);

        this.ticketService.assignTicket(this.id, this.assignForm.getRawValue()).subscribe({
        next: () => {
            this.isAssigning.set(false);
            this.notificationService.show('Ticket asignado correctamente.', 'success');
            this.loadTicket();
        },
        error: (err: HttpErrorResponse) => {
            this.isAssigning.set(false);
            const body = err.error as ApiErrorResponse | undefined;
            this.assignErrorMessage.set(body?.error?.message ?? 'No se pudo asignar el ticket.');
        }
        });
    }

    requestDelete(): void {
        this.showDeleteConfirm.set(true);
    }

    cancelDelete(): void {
        this.showDeleteConfirm.set(false);
    }

    confirmDelete(): void {
        this.showDeleteConfirm.set(false);
        this.isDeleting.set(true);

        this.ticketService.deleteTicket(this.id).subscribe({
        next: () => {
            this.notificationService.show('Ticket eliminado correctamente.', 'success');
            this.router.navigateByUrl('/tickets');
        },
        error: () => {
            this.isDeleting.set(false);
            this.errorMessage.set('No se pudo eliminar el ticket.');
        }
        });
    }
}