// services/notification.service.ts
import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/overlay';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationConfig {
  duration?: number;
  panelClass?: string | string[];
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
  action?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultDuration = 5000; // 5 seconds
  private snackBarRefs: Map<number, MatSnackBarRef<unknown>> = new Map();
  private nextId = 0;

  constructor(private snackBar: MatSnackBar) {}

  // Convenience methods
  success(message: string, duration?: number): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'success', { duration });
  }

  error(message: string, duration?: number): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'error', { duration });
  }

  info(message: string, duration?: number): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'info', { duration });
  }

  warning(message: string, duration?: number): MatSnackBarRef<TextOnlySnackBar> {
    return this.show(message, 'warning', { duration });
  }

  show(
    message: string,
    type: NotificationType = 'info',
    config: NotificationConfig = {}
  ): MatSnackBarRef<TextOnlySnackBar> {
    const id = this.nextId++;
    const duration = config.duration ?? this.defaultDuration;
    const panelClass = this.getPanelClasses(type, config.panelClass);

    const snackBarRef = this.snackBar.open(
      message,
      config.action || 'OK',
      {
        duration,
        panelClass,
        horizontalPosition: config.horizontalPosition || 'right',
        verticalPosition: config.verticalPosition || 'top',
        data: { ...config.data, notificationId: id }
      }
    );

    // Store the reference
    this.snackBarRefs.set(id, snackBarRef);

    // Clean up on dismiss
    snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarRefs.delete(id);
    });

    return snackBarRef;
  }

  // Show a component as a notification
  showComponent<T, D = any>(
    component: ComponentType<T>,
    config: MatSnackBarConfig<D>
  ): MatSnackBarRef<T> {
    const id = this.nextId++;
    const snackBarRef = this.snackBar.openFromComponent(component, {
      ...config,
      data: { ...config.data, notificationId: id }
    });

    // Store the reference
    this.snackBarRefs.set(id, snackBarRef);

    // Clean up on dismiss
    snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarRefs.delete(id);
    });

    return snackBarRef;
  }

  // Show a template as a notification
  showTemplate<T, D = any>(
    template: TemplateRef<T>,
    config: MatSnackBarConfig<D>
  ): MatSnackBarRef<unknown> {
    const id = this.nextId++;
    const snackBarRef = this.snackBar.openFromTemplate(template, {
      ...config,
      data: { ...config.data, notificationId: id }
    });

    // Store the reference
    this.snackBarRefs.set(id, snackBarRef);

    // Clean up on dismiss
    snackBarRef.afterDismissed().subscribe(() => {
      this.snackBarRefs.delete(id);
    });

    return snackBarRef as MatSnackBarRef<unknown>;
  }

  // Dismiss a specific notification by ID
  dismiss(id: number): void {
    const ref = this.snackBarRefs.get(id);
    if (ref) {
      ref.dismiss();
      this.snackBarRefs.delete(id);
    }
  }

  // Dismiss all notifications
  dismissAll(): void {
    this.snackBar.dismiss();
    this.snackBarRefs.clear();
  }

  // Alias for dismissAll for backward compatibility
  clearAll(): void {
    this.dismissAll();
  }

  // Get the count of currently shown notifications
  getNotificationCount(): number {
    return this.snackBarRefs.size;
  }

  // Get the count of notifications by type (not directly supported by MatSnackBar)
  getNotificationCountByType(): Record<NotificationType, number> {
    // Note: This is a simplified implementation since MatSnackBar doesn't track types
    // You might need to extend this if you need exact type-based counting
    return {
      success: 0,
      error: 0,
      info: 0,
      warning: 0
    };
  }

  // Helper to get panel classes based on notification type
  private getPanelClasses(
    type: NotificationType,
    additionalClasses?: string | string[]
  ): string[] {
    const classes = ['mat-snackbar-notification'];
    
    // Add type-specific class
    classes.push(`snackbar-${type}`);
    
    // Add any additional classes
    if (additionalClasses) {
      if (Array.isArray(additionalClasses)) {
        classes.push(...additionalClasses);
      } else {
        classes.push(additionalClasses);
      }
    }
    
    return classes;
  }

  ngOnDestroy(): void {
    this.dismissAll();
  }
}