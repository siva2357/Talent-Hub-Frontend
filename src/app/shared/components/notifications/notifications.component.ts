import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/model/notification.model';
import { DateTimeHelper } from '../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private notificationService = inject(NotificationService);

  notifications: AppNotification[] = [];
  showAllNotifications = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getUserNotifications().subscribe({
      next: (res) => {
        if (res && res.notifications) {
          this.notifications = res.notifications;
        }
      },
      error: (err) => {
        console.error('Failed to load notifications:', err);
      }
    });
  }

  get visibleNotifications(): AppNotification[] {
    return this.showAllNotifications ? this.notifications : this.notifications.slice(0, 4);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleShowAll(event: Event): void {
    event.stopPropagation();
    this.showAllNotifications = !this.showAllNotifications;
  }

  markAsRead(id: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        // Optimistically update read status locally
        const notif = this.notifications.find(n => n._id === id);
        if (notif) {
          notif.read = true;
        }
      },
      error: (err) => console.error('Failed to mark notification as read:', err)
    });
  }

  markAllAsRead(event: Event): void {
    event.stopPropagation();
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      },
      error: (err) => console.error('Failed to mark all as read:', err)
    });
  }

  deleteNotification(id: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n._id !== id);
      },
      error: (err) => console.error('Failed to delete notification:', err)
    });
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    this.notificationService.clearNotifications().subscribe({
      next: () => {
        this.notifications = [];
      },
      error: (err) => console.error('Failed to clear notifications:', err)
    });
  }

  getNotificationIcon(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('success') || t.includes('approve') || t.includes('complete')) {
      return 'bi-check-circle-fill';
    }
    if (t.includes('warning') || t.includes('alert') || t.includes('expire')) {
      return 'bi-exclamation-triangle-fill';
    }
    if (t.includes('error') || t.includes('fail') || t.includes('reject')) {
      return 'bi-x-circle-fill';
    }
    return 'bi-bell-fill';
  }

  getNotificationClass(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('success') || t.includes('approve') || t.includes('complete')) {
      return 'success';
    }
    if (t.includes('warning') || t.includes('alert') || t.includes('expire')) {
      return 'warning';
    }
    if (t.includes('error') || t.includes('fail') || t.includes('reject')) {
      return 'error';
    }
    return 'info';
  }
}
