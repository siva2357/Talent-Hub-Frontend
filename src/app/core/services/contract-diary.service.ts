import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractDiaryService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/contract-diary'; // Base URL for contract diary

  // --- Client Endpoints ---
  
  // Get all diaries for the logged-in client
  getMyDiaries(): Observable<any> {
    return this.get(`${this.apiUrl}/my-diaries`);
  }

  // Get a specific diary by Contract ID
  getDiaryByContractId(contractId: string): Observable<any> {
    return this.get(`${this.apiUrl}/contract/${contractId}`);
  }

  // Add a new phase to the contract diary
  addPhase(diaryId: string, payload: any): Observable<any> {
    return this.post(`${this.apiUrl}/${diaryId}/phases`, payload);
  }

  // Update an existing phase
  updatePhase(diaryId: string, phaseId: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}`, payload);
  }

  // Review a phase (approve/reject/request changes)
  reviewPhase(diaryId: string, phaseId: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}/review`, payload);
  }

  // --- Freelancer Endpoints ---

  // Get the diary for a specific contract as a freelancer
  getFreelancerDiary(contractId: string): Observable<any> {
    return this.get(`${this.apiUrl}/my-diary/${contractId}`);
  }

  // Start working on a phase
  startPhase(diaryId: string, phaseId: string): Observable<any> {
    return this.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}/start`, {});
  }

  // Submit a phase for review
  submitPhase(diaryId: string, phaseId: string, payload: any): Observable<any> {
    return this.put(`${this.apiUrl}/${diaryId}/phases/${phaseId}/submit`, payload);
  }

  // --- Shared Endpoints ---

  // Get a specific diary by its own ID (diaryId)
  getDiaryById(id: string): Observable<any> {
    return this.get(`${this.apiUrl}/${id}`);
  }
}
