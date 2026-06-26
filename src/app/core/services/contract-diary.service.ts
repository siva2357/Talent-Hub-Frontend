import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { AddPhaseFormDto, SubmitPhaseWorkDto } from '../DTOs/contract-diary.dto';

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


  /** Add a single phase to an existing diary */
  addPhase(diaryId: string, phase: AddPhaseFormDto): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.PHASES(diaryId)}`, phase, this.getHeaders());
  }

  /** Approve or request changes on a phase */
  reviewPhase(diaryId: string, phaseId: string, action: 'approve' | 'request-changes', clientFeedback?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.REVIEW_PHASE(diaryId, phaseId)}`, { action, clientFeedback }, this.getHeaders());
  }


getDiaryByContractId(
  contractId: string
): Observable<any> {

  return this.http.get(
    `${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.BY_CONTRACT(
      contractId
    )}`,
    this.getHeaders()
  );

}
  /** Get all diaries for the logged-in client */
  getClientDiaries(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.MY_DIARIES}`, this.getHeaders());
  }

  // ============================================================
  // FREELANCER
  // ============================================================

/** Get freelancer diary by contract id */
getFreelancerDiaries(
  contractId: string
): Observable<any> {

  return this.http.get(
    `${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.MY_DIARY(contractId)}`,
    this.getHeaders()
  );

}

getFreelancerAllDiaries(): Observable<any> {
  return this.http.get(
    `${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.MY_DIARIES_FREELANCER}`,
    this.getHeaders()
  );
}

  /** Start a phase (mark as in-progress) */
  startPhase(diaryId: string, phaseId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${API_ENDPOINTS.CONTRACT_DIARY.START_PHASE(diaryId, phaseId)}`, {}, this.getHeaders());
  }

  /** Submit a phase update with notes and file attachments */
  submitPhaseUpdate(diaryId: string, phaseId: string, data: SubmitPhaseWorkDto): Observable<any> {
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
