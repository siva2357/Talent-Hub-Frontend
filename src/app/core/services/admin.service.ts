import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

export interface ClientData {
  id: string;
  name: string; // Company Name
  clientName: string; // Client Contact Name
  email: string;
  phoneNumber: string;
  spent: number;
  projectsCount: number;
  status: 'Active' | 'Suspended' | 'Blocked' | 'Deactivated';
  joinedDate: string;
  logoColor: string;
  industry: string;
}

export interface FreelancerData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  skills: string[];
  hourlyRate: number;
  completedProjects: number;
  earnings: number;
  status: 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated';
  joinedDate: string;
  rating: number;
  title: string;
}

export interface TransactionData {
  id: string;
  contractTitle?: string;
  clientName: string;
  freelancerName: string;
  budget?: number;
  freelancerPayment?: number;
  commission?: number;
  amount: number;
  platformFee: number;
  status: string;
  date: string;
  type: string;
}

export interface SystemReport {
  id: string;
  title: string;
  description: string;
  category: 'Financial' | 'User Activity' | 'Platform Health';
  generatedDate: string;
  downloadUrl: string;
  size: string;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }



  // Clients API
  getClients(): Observable<ClientData[]> {
    return this.http.get<ClientData[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.CLIENTS}`,
      this.getHeaders()
    );
  }

  updateClientStatus(id: string, newStatus: 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.UPDATE_CLIENT_STATUS(id)}`,
      { status: newStatus },
      this.getHeaders()
    );
  }

  // Freelancers API
  getFreelancers(): Observable<FreelancerData[]> {
    return this.http.get<FreelancerData[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.FREELANCERS}`,
      this.getHeaders()
    );
  }

  updateFreelancerStatus(id: string, newStatus: 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'): Observable<any> {
    return this.http.patch<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.UPDATE_FREELANCER_STATUS(id)}`,
      { status: newStatus },
      this.getHeaders()
    );
  }

  approveFreelancer(id: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.APPROVE_FREELANCER(id)}`,
      {},
      this.getHeaders()
    );
  }

  // Transactions / Finances API
  getTransactions(): Observable<TransactionData[]> {
    return this.http.get<TransactionData[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.FINANCE_TRANSACTIONS}`,
      this.getHeaders()
    );
  }

  getFinancialStats(): Observable<{
    totalVolume: number;
    platformCommissions: number;
    escrowHeld: number;
    growthPercent: number;
  }> {
    return this.http.get<{
      totalVolume: number;
      platformCommissions: number;
      escrowHeld: number;
      growthPercent: number;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.FINANCE_STATS}`,
      this.getHeaders()
    );
  }

  // Reports API
  getReports(): Observable<SystemReport[]> {
    return this.http.get<SystemReport[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.REPORTS}`,
      this.getHeaders()
    );
  }

  generateReport(title: string, category: 'Financial' | 'User Activity' | 'Platform Health', description: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GENERATE_REPORT}`,
      { title, category, description },
      this.getHeaders()
    );
  }

  // Dashboard Stats API
  getDashboardStats(): Observable<{
    totalClients: number;
    totalFreelancers: number;
    activeContracts: number;
    totalCommissions: number;
  }> {
    return this.http.get<{
      totalClients: number;
      totalFreelancers: number;
      activeContracts: number;
      totalCommissions: number;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DASHBOARD_STATS}`,
      this.getHeaders()
    );
  }

  getRecentActivities(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.getDashboardStats().subscribe({
        next: (data: any) => {
          observer.next(data.activities || []);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }




}
