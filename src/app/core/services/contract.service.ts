import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { CreateContractDTO, UpdateContractDTO } from '../DTOs/contract.dto';
import { ContractResponse, ContractsResponse } from '../model/contract.model';
import { AppliedContractsResponse } from '../model/proposal.modal';

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  // ========================================
  // Authorization Headers
  // ========================================

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('th_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createContract(
    data: CreateContractDTO
  ): Observable<ContractResponse> {
    return this.http.post<ContractResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.BASE}`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Get My Contracts
  // ========================================

  getMyContracts(): Observable<ContractsResponse> {
    return this.http.get<ContractsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.MY_CONTRACTS}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Get My Contract By ID
  // ========================================

  getMyContractById(
    id: string
  ): Observable<ContractResponse> {
    return this.http.get<ContractResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.MY_CONTRACT(id)}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Update Contract
  // ========================================

  updateContract(
    id: string,
    data: UpdateContractDTO
  ): Observable<ContractResponse> {
    return this.http.put<ContractResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.ITEM(id)}`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Delete Contract
  // ========================================

  deleteContract(
    id: string
  ): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.ITEM(id)}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Get All Contracts
  // ========================================

  getAllContracts(): Observable<ContractsResponse> {
    return this.http.get<ContractsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.BASE}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Get Single Contract
  // ========================================

  getSingleContract(
    id: string
  ): Observable<ContractResponse> {
    return this.http.get<ContractResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.ITEM(id)}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Save Contract
  // ========================================

  saveContract(
    id: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.SAVE(id)}`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Unsave Contract
  // ========================================

  unsaveContract(
    id: string
  ): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.UNSAVE(id)}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Get Saved Contracts
  // ========================================

  getSavedContracts(): Observable<ContractsResponse> {
    return this.http.get<ContractsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.SAVED}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Apply To Contract
  // ========================================

  applyToContract(
    id: string
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.APPLY(id)}`,
      {},
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Withdraw Contract Application
  // ========================================

  withdrawContractApplication(
    id: string
  ): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.WITHDRAW(id)}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // ========================================
  // Get Applied Contracts
  // ========================================

getAppliedContracts(): Observable<AppliedContractsResponse> {

  return this.http.get<AppliedContractsResponse>(
    `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.APPLIED}`,
    {
      headers: this.getHeaders()
    }
  );

}

  // ========================================
  // Get Contract Applicants
  // ========================================
getContractApplicants(contractId?: string): Observable<any> {

  let params: any = {};

  if (contractId) {
    params.contractId = contractId;
  }

  return this.http.get(
    `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.APPLICANTS}`,
    {
      headers: this.getHeaders(),
      params
    }
  );
}

  // ========================================
  // Get Hired Talents
  // ========================================
getHiredTalents(contractId: string): Observable<any> {
  return this.http.get(
    `${this.baseUrl}${API_ENDPOINTS.CONTRACTS.HIRED}/${contractId}`,
    {
      headers: this.getHeaders()
    }
  );
}
}
