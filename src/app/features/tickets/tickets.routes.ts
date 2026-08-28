import { Routes } from '@angular/router';

import { roleGuard } from '../../core/guards/role.guard';
import { ROLES } from '../../core/constants/roles.constant';

export const TICKETS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./ticket-list/ticket-list').then((m) => m.TicketList)
    },
    {
        path: 'new',
        canActivate: [roleGuard([ROLES.ADMIN, ROLES.CLIENT])],
        loadComponent: () => import('./ticket-form/ticket-form').then((m) => m.TicketForm)
    },
    {
        path: ':id/edit',
        canActivate: [roleGuard([ROLES.ADMIN, ROLES.AGENT])],
        loadComponent: () => import('./ticket-edit/ticket-edit').then((m) => m.TicketEdit)
    },
    {
        path: ':id',
        loadComponent: () => import('./ticket-detail/ticket-detail').then((m) => m.TicketDetail)
    }
];