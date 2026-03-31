import { Component, OnInit } from '@angular/core';
import { AppNotification } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-layout',
  templateUrl: './notification-layout.html',
  styleUrl: './notification-layout.css',
  imports: [DatePipe],
  standalone:true
})
export class NotificationLayout implements OnInit {

  notifications: AppNotification[] = [];
  unreadCount: number = 0;
  loading = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getUserNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.read).length;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.loadNotifications();
    });
  }

  markAllRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
    });
  }

  deleteNotification(id: string) {
    this.notificationService.deleteNotification(id).subscribe(() => {
      this.loadNotifications();
    });
  }

  clearAll() {
    this.notificationService.clearUserNotifications().subscribe(() => {
      this.loadNotifications();
    });
  }
}
