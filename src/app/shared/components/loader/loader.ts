import { Component, inject } from '@angular/core';

import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    template: `
        @if (loadingService.isLoading()) {
        <div class="app-loader"></div>
        }
    `,
    styleUrl: './loader.scss'
})
export class Loader {
    protected readonly loadingService = inject(LoadingService);
}