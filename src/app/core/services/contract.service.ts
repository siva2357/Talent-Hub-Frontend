import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { CreateContractDto, UpdateContractDto } from '../dtos/contract.dto';

@Injectable({
  providedIn: 'root'
})

export class ContractService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/contracts'; // Base URL for contracts

  // --- Client Endpoints ---
  getMyContracts(): Observable<{ success: boolean; contracts: Contract[] }> {
    return this.get<{ success: boolean; contracts: Contract[] }>(`${this.apiUrl}/my-contracts`);
  }

  getClientContractById(id: string): Observable<{ success: boolean; contract: Contract }> {
    return this.get<{ success: boolean; contract: Contract }>(`${this.apiUrl}/my-contracts/${id}`);
  }

  createContract(payload: CreateContractDto): Observable<{ success: boolean; data: Contract }> {
    return this.post<{ success: boolean; data: Contract }>(`${this.apiUrl}`, payload);
  }

  updateContract(id: string, payload: UpdateContractDto): Observable<{ success: boolean; data: Contract }> {
    return this.put<{ success: boolean; data: Contract }>(`${this.apiUrl}/${id}`, payload);
  }

  deleteContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // --- Freelancer Endpoints ---
  getFreelancerMyContracts(): Observable<{ success: boolean; contracts: any[] }> {
    return this.get<{ success: boolean; contracts: any[] }>(`${this.apiUrl}/freelancer/my-contracts`);
  }

  getAllContracts(): Observable<{ success: boolean; contracts: Contract[] }> {
    return this.get<{ success: boolean; contracts: Contract[] }>(`${this.apiUrl}`);
  }

  getContractById(id: string): Observable<{ success: boolean; data: Contract }> {
    return this.get<{ success: boolean; data: Contract }>(`${this.apiUrl}/${id}`);
  }

  applyForContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>(`${this.apiUrl}/apply/${id}`, {});
  }

  withdrawFromContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`${this.apiUrl}/withdraw/${id}`);
  }

  saveContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.post<{ success: boolean; message: string }>(`${this.apiUrl}/save/${id}`, {});
  }

  unsaveContract(id: string): Observable<{ success: boolean; message: string }> {
    return this.delete<{ success: boolean; message: string }>(`${this.apiUrl}/unsave/${id}`);
  }

  getSavedContracts(): Observable<{ success: boolean; contracts: Contract[] }> {
    return this.get<{ success: boolean; contracts: Contract[] }>(`${this.apiUrl}/saved-contracts`);
  }

  getAppliedContracts(): Observable<any> {
    return this.get(`${this.apiUrl}/applied-contracts`);
  }

  getContractApplicants(contractId: string): Observable<any> {
    return this.get(`${this.apiUrl}/my-contracts/applicants?contractId=${contractId}`);
  }







}
