import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  /**
   * Retrieves the current user's notifications.
   */
  getUserNotifications(): Observable<{ notifications: AppNotification[] }> {
    return this.http.get<{ notifications: AppNotification[] }>(`${this.baseUrl}/notifications/notifications`);
  }

  /**
   * Marks a specific notification as read.
   */
  markAsRead(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/notifications/notifications/${id}/read`, {});
  }

  /**
   * Marks all notifications as read.
   */
  markAllAsRead(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/notifications/notifications/read-all`, {});
  }

  /**
   * Deletes a specific notification.
   */
  deleteNotification(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/notifications/notifications/${id}/delete`);
  }

  /**
   * Clears/deletes all notifications for the current user.
   */
  clearNotifications(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/notifications/notifications/clear`);
  }
}
