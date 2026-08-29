import { Injectable, OnDestroy } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject, Observable, timer, Subscription } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService implements OnDestroy {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private pollingSubscription?: Subscription;

  constructor() {
    super();
    this.startPolling();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  private startPolling(): void {
    // Poll every 30 seconds
    this.pollingSubscription = timer(0, 30000).pipe(
      switchMap(() => this.get<{ notifications: Notification[] }>(`${environment.apiGatewayUrl}/notifications/notifications`)),
      catchError(err => {
        console.error('Failed to fetch notifications', err);
        return [];
      })
    ).subscribe((response: any) => {
      const notifs = response?.notifications || [];
      this.notificationsSubject.next(notifs);
      this.updateUnreadCount(notifs);
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.patch(`${environment.apiGatewayUrl}/notifications/notifications/${id}/read`, {}).pipe(
      tap(() => {
        const notifs = this.notificationsSubject.value;
        const index = notifs.findIndex(n => n._id === id);
        if (index !== -1) {
          notifs[index].read = true;
          this.notificationsSubject.next([...notifs]);
          this.updateUnreadCount(notifs);
        }
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.patch(`${environment.apiGatewayUrl}/notifications/notifications/read-all`, {}).pipe(
      tap(() => {
        const notifs = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(notifs);
        this.updateUnreadCount(notifs);
      })
    );
  }

  clearAll(): Observable<any> {
    return this.delete(`${environment.apiGatewayUrl}/notifications/notifications/clear`).pipe(
      tap(() => {
        this.notificationsSubject.next([]);
        this.updateUnreadCount([]);
      }),
      catchError(err => {
        // Fallback for UI if endpoint doesn't exist yet
        this.notificationsSubject.next([]);
        this.updateUnreadCount([]);
        return [];
      })
    );
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unread = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unread);
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}
