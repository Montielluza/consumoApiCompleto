import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-paginator',
    standalone: true,
    template: `
        <div class="paginator">
        <button type="button" class="btn--outline" [disabled]="page <= 1" (click)="pageChange.emit(page - 1)">
            Anterior
        </button>
        <span>Página {{ page }} de {{ totalPages }} ({{ total }} resultados)</span>
        <button
            type="button"
            class="btn--outline"
            [disabled]="page >= totalPages"
            (click)="pageChange.emit(page + 1)"
        >
            Siguiente
        </button>
        </div>
    `,
    styleUrl: './paginator.scss'
})
export class Paginator {
    @Input() page = 1;
    @Input() totalPages = 1;
    @Input() total = 0;
    @Output() pageChange = new EventEmitter<number>();
}