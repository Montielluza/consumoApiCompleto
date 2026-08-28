import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationService } from './core/services/notification.service';
import { Loader } from './shared/components/loader/loader';
import { Alert } from './shared/components/alert/alert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Loader, Alert],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly notificationService = inject(NotificationService);
}