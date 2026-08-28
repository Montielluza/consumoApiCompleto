import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    standalone: true,
    template: `<span class="app-spinner" [style.width.px]="size" [style.height.px]="size"></span>`,
    styleUrl: './spinner.scss'
})
export class Spinner {
    @Input() size = 20;
}