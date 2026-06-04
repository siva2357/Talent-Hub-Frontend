import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.DASHBOARD.STATS}`, this.getHeaders());
  }
}
