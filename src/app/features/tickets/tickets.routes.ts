import { Routes } from '@angular/router';

export const TICKETS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./ticket-list/ticket-list').then((m) => m.TicketList)
    },
    {
        path: ':id',
        loadComponent: () => import('./ticket-detail/ticket-detail').then((m) => m.TicketDetail)
    }
];