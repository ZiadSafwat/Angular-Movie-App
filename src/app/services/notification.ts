// services/notification.service.ts
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<Notification[]>([]);

  show(message: string, type: Notification['type'] = 'info', duration: number = 3000): void {
    const id = Date.now();
    const notification: Notification = { id, message, type, duration };
    
    this.notifications.update(notifs => [...notifs, notification]);
    
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  dismiss(id: number): void {
    this.notifications.update(notifs => notifs.filter(notif => notif.id !== id));
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}