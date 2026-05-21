import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { CreateContractDTO, UpdateContractDTO } from '../DTOs/contract.dto';
import { ContractResponse, ContractsResponse } from '../model/contract.model';

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = environment.apiGatewayUrl + '/contracts';


  // ========================================
  // Authorization Headers
  // ========================================

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createContract(
    data: CreateContractDTO
  ): Observable<ContractResponse> {

    return this.http.post<ContractResponse>(
      `${this.baseUrl}`,
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
      `${this.baseUrl}/my-contracts`,
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
      `${this.baseUrl}/my-contracts/${id}`,
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
      `${this.baseUrl}/${id}`,
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
      `${this.baseUrl}/${id}`,
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
      `${this.baseUrl}`,
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
      `${this.baseUrl}/${id}`,
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
      `${this.baseUrl}/save/${id}`,
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
      `${this.baseUrl}/unsave/${id}`,
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
      `${this.baseUrl}/saved-contracts`,
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
      `${this.baseUrl}/apply/${id}`,
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
      `${this.baseUrl}/withdraw/${id}`,
      {
        headers: this.getHeaders()
      }
    );

  }



  // ========================================
  // Get Applied Contracts
  // ========================================

  getAppliedContracts(): Observable<ContractsResponse> {

    return this.http.get<ContractsResponse>(
      `${this.baseUrl}/applied-contracts`,
      {
        headers: this.getHeaders()
      }
    );

  }



  // ========================================
  // Get Contract Applicants
  // ========================================

  getContractApplicants(
    contractId: string
  ): Observable<any> {

    return this.http.get(
      `${this.baseUrl}/my-contracts/${contractId}/applicants`,
      {
        headers: this.getHeaders()
      }
    );

  }



}
