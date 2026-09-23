import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/applications'; // Assuming /api/applications based on standard convention

  getApplicationById(id: string): Observable<any> {
    return this.get(`${this.apiUrl}/${id}`);
  }

  getInterviews(): Observable<any> {
    return this.get(`${this.apiUrl}/interviews`);
  }

  shortlistApplication(id: string): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/shortlist`, {});
  }

  rejectApplication(id: string): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/reject`, {});
  }

  scheduleAssessment(id: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/assessment`, payload);
  }

  submitAssessment(id: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/submit-assessment`, payload);
  }

  assessmentResult(id: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/assessment-result`, payload);
  }

  scheduleInterview(id: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/interview`, payload);
  }

  interviewResult(id: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/interview-result`, payload);
  }

  finalizeApplication(id: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${id}/finalize`, payload);
  }
}
