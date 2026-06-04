import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
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
    return this.http.get<{ notifications: AppNotification[] }>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.GET_ALL}`);
  }

  /**
   * Marks a specific notification as read.
   */
  markAsRead(id: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)}`, {});
  }

  /**
   * Marks all notifications as read.
   */
  markAllAsRead(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ}`, {});
  }

  /**
   * Deletes a specific notification.
   */
  deleteNotification(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.DELETE(id)}`);
  }

  /**
   * Clears/deletes all notifications for the current user.
   */
  clearNotifications(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.CLEAR}`);
  }
}
