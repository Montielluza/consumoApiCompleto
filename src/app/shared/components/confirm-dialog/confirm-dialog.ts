import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Modal } from '../modal/modal';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [Modal],
    template: `
        <app-modal (close)="cancel.emit()">
        <h3 class="confirm-dialog__title">{{ title }}</h3>
        <p class="confirm-dialog__message">{{ message }}</p>
        <div class="confirm-dialog__actions">
            <button type="button" class="btn--outline" (click)="cancel.emit()">Cancelar</button>
            <button type="button" class="btn--danger" (click)="confirm.emit()">{{ confirmLabel }}</button>
        </div>
        </app-modal>
    `,
    styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
    @Input() title = 'Confirmar acción';
    @Input() message = '¿Estás seguro? Esta acción no se puede deshacer.';
    @Input() confirmLabel = 'Confirmar';
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    }