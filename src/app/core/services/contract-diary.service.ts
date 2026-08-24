import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractDiaryService {
  private apiUrl = 'http://localhost:5000/api/contract-diary'; // Base URL for contract diary

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Client Endpoints ---
  
  // Get all diaries for the logged-in client
  getMyDiaries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-diaries`, { headers: this.getAuthHeaders() });
  }

  // Get a specific diary by Contract ID
  getDiaryByContractId(contractId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/contract/${contractId}`, { headers: this.getAuthHeaders() });
  }

  // Add a new phase to the contract diary
  addPhase(diaryId: string, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${diaryId}/phases`, payload, { headers: this.getAuthHeaders() });
  }

  // Update an existing phase
  updatePhase(diaryId: string, phaseId: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}`, payload, { headers: this.getAuthHeaders() });
  }

  // Review a phase (approve/reject/request changes)
  reviewPhase(diaryId: string, phaseId: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}/review`, payload, { headers: this.getAuthHeaders() });
  }

  // --- Freelancer Endpoints ---

  // Get the diary for a specific contract as a freelancer
  getFreelancerDiary(contractId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-diary/${contractId}`, { headers: this.getAuthHeaders() });
  }

  // Start working on a phase
  startPhase(diaryId: string, phaseId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}/start`, {}, { headers: this.getAuthHeaders() });
  }

  // Submit a phase for review
  submitPhase(diaryId: string, phaseId: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}/submit`, payload, { headers: this.getAuthHeaders() });
  }

  // --- Shared Endpoints ---

  // Get a specific diary by its own ID (diaryId)
  getDiaryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
