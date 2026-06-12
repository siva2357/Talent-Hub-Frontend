import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class ContractDiaryService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

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
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.BASE}`, data, this.getHeaders());
  }

  /** Add a single phase to an existing diary */
  addPhase(diaryId: string, phase: { name: string; description?: string; deadline?: string; amount?: number; clientAttachments?: any[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.PHASES(diaryId)}`, phase, this.getHeaders());
  }

  /** Approve or request changes on a phase */
  reviewPhase(diaryId: string, phaseId: string, action: 'approve' | 'request-changes', clientFeedback?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.REVIEW_PHASE(diaryId, phaseId)}`, { action, clientFeedback }, this.getHeaders());
  }

  /** Get all diaries for the logged-in client */
  getClientDiaries(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.MY_DIARIES}`, this.getHeaders());
  }

  // ============================================================
  // FREELANCER
  // ============================================================

  /** Get all diaries assigned to the logged-in freelancer */
  getFreelancerDiaries(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.MY_DIARY}`, this.getHeaders());
  }

  /** Start a phase (mark as in-progress) */
  startPhase(diaryId: string, phaseId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.START_PHASE(diaryId, phaseId)}`, {}, this.getHeaders());
  }

  /** Submit a phase update with notes and file attachments */
  submitPhaseUpdate(diaryId: string, phaseId: string, data: { freelancerNote?: string; attachments?: any[] }): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.SUBMIT_PHASE(diaryId, phaseId)}`, data, this.getHeaders());
  }

  // ============================================================
  // SHARED
  // ============================================================

  /** Get a single diary by ID */
  getDiaryById(diaryId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.ITEM(diaryId)}`, this.getHeaders());
  }
}
