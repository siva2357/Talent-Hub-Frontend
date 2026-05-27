import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  // ========================================
  // Injects
  // ========================================

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  // ========================================
  // API URL
  // ========================================

  private readonly baseUrl = environment.apiGatewayUrl + '/applications';

  // ========================================
  // Headers
  // ========================================

  private getHeaders() {
    const token = localStorage.getItem('th_token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  // ========================================
  // Shortlist Application
  // ========================================

  shortlistApplication(applicationId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/shortlist`,

      {},

      this.getHeaders(),
    );
  }

  // ========================================
  // Reject Application
  // ========================================

  rejectApplication(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/reject`,

      data,

      this.getHeaders(),
    );
  }

  // ========================================
  // Schedule Assessment
  // ========================================

  scheduleAssessment(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/assessment`,

      data,

      this.getHeaders(),
    );
  }

  // ========================================
  // Assessment Result
  // ========================================

  assessmentResult(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/assessment-result`,

      data,

      this.getHeaders(),
    );
  }

  // ========================================
  // Schedule Interview
  // ========================================

  scheduleInterview(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/interview`,

      data,

      this.getHeaders(),
    );
  }

  // ========================================
  // Interview Result
  // ========================================

  interviewResult(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/interview-result`,

      data,

      this.getHeaders(),
    );
  }

  // ========================================
  // Finalize Application
  // ========================================

  finalizeApplication(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/finalize`,

      data,

      this.getHeaders(),
    );
  }

  // ========================================
  // Submit Assessment (Freelancer)
  // ========================================

  submitAssessment(applicationId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/submit-assessment`,
      {},
      this.getHeaders()
    );
  }

  // ========================================
  // Send Offer (Client)
  // ========================================

  sendOffer(applicationId: string, data: { scopeOfWork: string, additionalTerms: string }): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/send-offer`,
      data,
      this.getHeaders()
    );
  }

  // ========================================
  // Sign Offer (Freelancer)
  // ========================================

  signOffer(applicationId: string, data: { signatureImage: string }): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/sign-offer`,
      data,
      this.getHeaders()
    );
  }

  // ========================================
  // Decline Offer (Freelancer)
  // ========================================

  declineOffer(applicationId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${applicationId}/decline-offer`,
      {},
      this.getHeaders()
    );
  }

  // ========================================
  // Get Freelancer Offers (Freelancer)
  // ========================================

  getFreelancerOffers(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/my-offers`,
      this.getHeaders()
    );
  }

  // ========================================
  // Get Application By ID
  // ========================================

  getApplicationById(applicationId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/${applicationId}`,
      this.getHeaders()
    );
  }

  // ========================================
  // Get Contract PDF URL
  // ========================================

  getContractPdfUrl(applicationId: string): string {
    const token = localStorage.getItem('th_token');
    return `${this.baseUrl}/${applicationId}/contract-pdf?token=${token}`;
  }
}
