// components/notification/notification.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';
 

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notificationService.notifications()"
        [class]="'notification ' + notification.type"
        (click)="dismiss(notification.id)"
      >
        {{ notification.message }}
        <button class="close-btn" (click)="dismiss(notification.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
    .notification {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 250px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .success { background: #4caf50; }
    .error { background: #f44336; }
    .info { background: #2196f3; }
    .warning { background: #ff9800; }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}