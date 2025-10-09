// components/notification/notification.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * This component is now a thin wrapper around MatSnackBar.
 * All the notification display logic is handled by the NotificationService.
 * 
 * The component is kept for backward compatibility but doesn't need to 
 * implement any functionality as MatSnackBar handles all the UI and animations.
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- This component is intentionally left empty -->
    <!-- All notifications are handled by MatSnackBar from the NotificationService -->
    <div></div>
  `
})
export class NotificationComponent {
  // No implementation needed - this is just a placeholder component
  // for backward compatibility
}