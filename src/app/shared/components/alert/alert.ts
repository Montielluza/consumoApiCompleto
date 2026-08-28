import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [NgClass],
    template: `
        <div class="alert app-alert" [ngClass]="'alert--' + type">
        <span>{{ message }}</span>
        <button type="button" class="app-alert__close" (click)="dismiss.emit()" aria-label="Cerrar">
            &times;
        </button>
        </div>
    `,
    styleUrl: './alert.scss'
})
export class Alert {
    @Input() type: 'success' | 'danger' = 'danger';
    @Input() message = '';
    @Output() dismiss = new EventEmitter<void>();
}
