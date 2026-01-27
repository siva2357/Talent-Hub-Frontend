import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    private baseUrl: string = `${environment.apiGatewayUrl}`; // Make sure this matches backend route

  constructor(private http: HttpClient) {}

private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('Authorization'); // ✅ FIXED KEY

  if (!token) {
    console.error("🚨 No token found in localStorage!");
    return new HttpHeaders();
  }

  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
}


  getUserNotifications(userType: string, userId: string): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.baseUrl}/notification/${userType}/${userId}`, {
      headers: this.getHeaders()
    });
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/notification/${id}/read`, {}, {
      headers: this.getHeaders()
    });
  }

  markAllAsRead(userType: string, userId: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/notification/${userType}/${userId}/read-all`, {}, {
      headers: this.getHeaders()
    });
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notification/${id}`, {
      headers: this.getHeaders()
    });
  }

  clearUserNotifications(userType: string, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notification/clear/${userType}/${userId}`, {
      headers: this.getHeaders()
    });
  }
}
