import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api/applications'; // Assuming /api/applications based on standard convention

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getApplicationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getInterviews(): Observable<any> {
    return this.http.get(`${this.apiUrl}/interviews`, { headers: this.getAuthHeaders() });
  }

  shortlistApplication(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/shortlist`, {}, { headers: this.getAuthHeaders() });
  }

  rejectApplication(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {}, { headers: this.getAuthHeaders() });
  }

  scheduleAssessment(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/assessment`, payload, { headers: this.getAuthHeaders() });
  }

  submitAssessment(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/submit-assessment`, payload, { headers: this.getAuthHeaders() });
  }

  assessmentResult(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/assessment-result`, payload, { headers: this.getAuthHeaders() });
  }

  scheduleInterview(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/interview`, payload, { headers: this.getAuthHeaders() });
  }

  interviewResult(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/interview-result`, payload, { headers: this.getAuthHeaders() });
  }

  finalizeApplication(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/finalize`, payload, { headers: this.getAuthHeaders() });
  }
}
