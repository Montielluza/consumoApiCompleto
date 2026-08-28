import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    template: `
        <div class="empty-state">
        <p>{{ message }}</p>
        <ng-content></ng-content>
        </div>
    `,
    styleUrl: './empty-state.scss'
})
export class EmptyState {
    @Input() message = 'No hay elementos para mostrar.';
}