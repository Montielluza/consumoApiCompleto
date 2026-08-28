import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'danger';

export interface AppNotification {
    id: number;
    type: NotificationType;
    message: string;
    }

    @Injectable({ providedIn: 'root' })
    export class NotificationService {
    private nextId = 1;

    readonly notifications = signal<AppNotification[]>([]);

    show(message: string, type: NotificationType = 'danger'): void {
        const id = this.nextId++;
        this.notifications.update((list) => [...list, { id, type, message }]);
        setTimeout(() => this.dismiss(id), 5000);
    }

    dismiss(id: number): void {
        this.notifications.update((list) => list.filter((n) => n.id !== id));
    }
}