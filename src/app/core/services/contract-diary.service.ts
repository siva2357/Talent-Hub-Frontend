import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractDiaryService {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl + '/contract-diary';

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  // ============================================================
  // CLIENT
  // ============================================================

  /** Initialize a new diary with phases for an accepted application */
  initializeDiary(data: { applicationId: string; phases: any[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data, this.getHeaders());
  }

  /** Add a single phase to an existing diary */
  addPhase(diaryId: string, phase: { name: string; description?: string; deadline?: string; amount?: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${diaryId}/phases`, phase, this.getHeaders());
  }

  /** Approve or request changes on a phase */
  reviewPhase(diaryId: string, phaseId: string, action: 'approve' | 'request-changes', clientFeedback?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${diaryId}/phases/${phaseId}/review`, { action, clientFeedback }, this.getHeaders());
  }

  /** Get all diaries for the logged-in client */
  getClientDiaries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-diaries`, this.getHeaders());
  }

  // ============================================================
  // FREELANCER
  // ============================================================

  /** Get all diaries assigned to the logged-in freelancer */
  getFreelancerDiaries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/my-diary`, this.getHeaders());
  }

  /** Start a phase (mark as in-progress) */
  startPhase(diaryId: string, phaseId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${diaryId}/phases/${phaseId}/start`, {}, this.getHeaders());
  }

  /** Submit a phase update with notes and file attachments */
  submitPhaseUpdate(diaryId: string, phaseId: string, data: { freelancerNote?: string; attachments?: any[] }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${diaryId}/phases/${phaseId}/submit`, data, this.getHeaders());
  }

  // ============================================================
  // SHARED
  // ============================================================

  /** Get a single diary by ID */
  getDiaryById(diaryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${diaryId}`, this.getHeaders());
  }
}
