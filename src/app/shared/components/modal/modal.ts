import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-modal',
    standalone: true,
    template: `
        <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal-panel" (click)="$event.stopPropagation()">
            <ng-content></ng-content>
        </div>
        </div>
    `,
    styleUrl: './modal.scss'
})
export class Modal {
    @Output() close = new EventEmitter<void>();
}