import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `<footer class="app-footer">Help Desk &copy; {{ year }} &mdash; Proyecto educativo</footer>`,
    styleUrl: './footer.scss'
})
export class Footer {
    readonly year = new Date().getFullYear();
}