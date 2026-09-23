import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  private readonly API_URL = 'http://localhost:5000/api/admin';

  getUserStatusOptions(): Observable<any> {
    return this.get<any>(`${this.API_URL}/users/status-options`);
  }

  getAllClients(): Observable<any> {
    return this.get<any>(`${this.API_URL}/clients`);
  }

  updateClientStatus(id: string, status: string): Observable<any> {
    return this.patch<any>(`${this.API_URL}/clients/${id}/status`, { status });
  }

  getAllFreelancers(): Observable<any> {
    return this.get<any>(`${this.API_URL}/freelancers`);
  }

  updateFreelancerStatus(id: string, status: string): Observable<any> {
    return this.patch<any>(`${this.API_URL}/freelancers/${id}/status`, { status });
  }

  approveFreelancer(id: string): Observable<any> {
    return this.post<any>(`${this.API_URL}/freelancers/${id}/approve`, {});
  }

  getAdminStats(): Observable<any> {
    return this.get<any>(`${this.API_URL}/dashboard/stats`);
  }

  getReports(): Observable<any> {
    return this.get<any>(`${this.API_URL}/reports`);
  }

  generateReport(data: any): Observable<any> {
    return this.post<any>(`${this.API_URL}/reports`, data);
  }

  getReportData(id: string, period?: string): Observable<any> {
    const url = period ? `${this.API_URL}/reports/${id}/data?period=${period}` : `${this.API_URL}/reports/${id}/data`;
    return this.get<any>(url);
  }

  downloadReportFile(id: string, period?: string): Observable<Blob> {
    const url = period ? `${this.API_URL}/reports/${id}/download?period=${period}` : `${this.API_URL}/reports/${id}/download`;
    return this.http.get(url, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
