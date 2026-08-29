import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllClients(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/clients`);
  }

  updateClientStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/clients/${id}/status`, { status });
  }

  getAllFreelancers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/freelancers`);
  }

  updateFreelancerStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/freelancers/${id}/status`, { status });
  }

  approveFreelancer(id: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/freelancers/${id}/approve`, {});
  }

  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/dashboard/stats`);
  }

  getReports(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/reports`);
  }

  generateReport(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/reports`, data);
  }

  getReportData(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/reports/${id}/data`);
  }

  downloadReportFile(id: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reports/${id}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
