import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { CreateContractDto, UpdateContractDto } from '../dtos/contract.dto';

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private apiUrl = 'http://localhost:5000/api/contracts'; // Base URL for contracts

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Client Endpoints ---
  getMyContracts(): Observable<{ success: boolean; contracts: Contract[] }> {
    return this.http.get<{ success: boolean; contracts: Contract[] }>(`${this.apiUrl}/my-contracts`, { headers: this.getAuthHeaders() });
  }

  getClientContractById(id: string): Observable<{ success: boolean; contract: Contract }> {
    return this.http.get<{ success: boolean; contract: Contract }>(`${this.apiUrl}/my-contracts/${id}`, { headers: this.getAuthHeaders() });
  }

  createContract(payload: CreateContractDto): Observable<{ success: boolean; data: Contract }> {
    return this.http.post<{ success: boolean; data: Contract }>(`${this.apiUrl}`, payload, { headers: this.getAuthHeaders() });
  }

  updateContract(id: string, payload: UpdateContractDto): Observable<{ success: boolean; data: Contract }> {
    return this.http.put<{ success: boolean; data: Contract }>(`${this.apiUrl}/${id}`, payload, { headers: this.getAuthHeaders() });
  }

  deleteContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Freelancer Endpoints ---
  getFreelancerMyContracts(): Observable<{ success: boolean; contracts: any[] }> {
    return this.http.get<{ success: boolean; contracts: any[] }>(`${this.apiUrl}/freelancer/my-contracts`, { headers: this.getAuthHeaders() });
  }

  getAllContracts(): Observable<{ success: boolean; contracts: Contract[] }> {
    return this.http.get<{ success: boolean; contracts: Contract[] }>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  getContractById(id: string): Observable<{ success: boolean; data: Contract }> {
    return this.http.get<{ success: boolean; data: Contract }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  applyForContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/apply/${id}`, {}, { headers: this.getAuthHeaders() });
  }

  withdrawFromContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/withdraw/${id}`, { headers: this.getAuthHeaders() });
  }

  saveContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/save/${id}`, {}, { headers: this.getAuthHeaders() });
  }

  unsaveContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/unsave/${id}`, { headers: this.getAuthHeaders() });
  }

  getSavedContracts(): Observable<{ success: boolean; contracts: Contract[] }> {
    return this.http.get<{ success: boolean; contracts: Contract[] }>(`${this.apiUrl}/saved-contracts`, { headers: this.getAuthHeaders() });
  }

  getAppliedContracts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applied-contracts`, { headers: this.getAuthHeaders() });
  }

  getContractApplicants(contractId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-contracts/applicants?contractId=${contractId}`, { headers: this.getAuthHeaders() });
  }







}
