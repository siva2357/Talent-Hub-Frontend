import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    private baseUrl: string = `${environment.apiGatewayUrl}`; // Make sure this matches backend route

  constructor(private http: HttpClient) {}


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }


  getUserNotifications(): Observable<AppNotification[]> {
    return this.http
      .get<{ notifications: AppNotification[] }>(
        `${this.baseUrl}/notifications`,
        { headers: this.getHeaders() }
      )
      .pipe(
        map(res => res.notifications || []),
        catchError(this.handleError)
      );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/notifications/${id}/read`, {}, {
      headers: this.getHeaders()
    });
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.baseUrl}/notifications/read-all`, {}, {
      headers: this.getHeaders()
    });
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/${id}/delete`, {
      headers: this.getHeaders()
    });
  }

  clearUserNotifications(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/clear`, {
      headers: this.getHeaders()
    });
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

}


