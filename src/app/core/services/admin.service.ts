import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) { }

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
}
