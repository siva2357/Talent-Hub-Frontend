import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { Badge } from '../../../ui/components/badge/badge';
import { Notification } from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, Badge],
  templateUrl: './notification-dropdown.html',
  styleUrl: './notification-dropdown.css'
})
export class NotificationDropdown implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  visibleLimit: number = 4;
  private subscriptions: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) { }

  get visibleNotifications(): Notification[] {
    return this.notifications.slice(0, this.visibleLimit);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.notificationService.getNotifications().subscribe(notifs => {
        this.notifications = notifs;
      })
    );
    this.subscriptions.add(
      this.notificationService.getUnreadCount().subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  viewMore(event: Event): void {
    event.preventDefault();
    this.visibleLimit = 6;
  }

  viewLess(event: Event): void {
    event.preventDefault();
    this.visibleLimit = 4;
  }

  markAllAsRead(event: Event): void {
    event.preventDefault();
    this.subscriptions.add(
      this.notificationService.markAllAsRead().subscribe()
    );
  }

  markAsRead(event: Event, id: string): void {
    event.preventDefault();
    this.subscriptions.add(
      this.notificationService.markAsRead(id).subscribe()
    );
  }

  clearAll(event: Event): void {
    event.preventDefault();
    this.subscriptions.add(
      this.notificationService.clearAll().subscribe()
    );
  }
}
