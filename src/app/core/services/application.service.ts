import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { AuthService } from './auth.service';
import { SendOfferDto, ScheduleAssessmentDto, AssessmentResultDto, ScheduleInterviewDto, InterviewResultDto } from '../DTOs/application.dto';

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

  private readonly baseUrl = environment.apiGatewayUrl;

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
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.SHORTLIST(applicationId)}`,
      {},
      this.getHeaders(),
    );
  }

  // ========================================
  // Reject Application
  // ========================================

  rejectApplication(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.REJECT(applicationId)}`,
      data,
      this.getHeaders(),
    );
  }

  // ========================================
  // Schedule Assessment
  // ========================================

  scheduleAssessment(applicationId: string, data: ScheduleAssessmentDto): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.ASSESSMENT(applicationId)}`,
      data,
      this.getHeaders(),
    );
  }

  // ========================================
  // Assessment Result
  // ========================================

  assessmentResult(applicationId: string, data: AssessmentResultDto): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.ASSESSMENT_RESULT(applicationId)}`,
      data,
      this.getHeaders(),
    );
  }

  // ========================================
  // Schedule Interview
  // ========================================

  scheduleInterview(applicationId: string, data: ScheduleInterviewDto): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.INTERVIEW(applicationId)}`,
      data,
      this.getHeaders(),
    );
  }

  // ========================================
  // Interview Result
  // ========================================

  interviewResult(applicationId: string, data: InterviewResultDto): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.INTERVIEW_RESULT(applicationId)}`,
      data,
      this.getHeaders(),
    );
  }

  // ========================================
  // Finalize Application
  // ========================================

  finalizeApplication(applicationId: string, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.FINALIZE(applicationId)}`,
      data,
      this.getHeaders(),
    );
  }

  // ========================================
  // Submit Assessment (Freelancer)
  // ========================================

  submitAssessment(applicationId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.SUBMIT_ASSESSMENT(applicationId)}`,
      {},
      this.getHeaders()
    );
  }

  // ========================================
  // Send Offer (Client)
  // ========================================

  sendOffer(applicationId: string, data: SendOfferDto): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.SEND_OFFER(applicationId)}`,
      data,
      this.getHeaders()
    );
  }

  // ========================================
  // Sign Offer (Freelancer)
  // ========================================

  signOffer(applicationId: string, data: { signatureImage: string }): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.SIGN_OFFER(applicationId)}`,
      data,
      this.getHeaders()
    );
  }

  // ========================================
  // Decline Offer (Freelancer)
  // ========================================

  declineOffer(applicationId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.DECLINE_OFFER(applicationId)}`,
      {},
      this.getHeaders()
    );
  }



  // ========================================
  // Get Application By ID
  // ========================================

  getApplicationById(applicationId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.ITEM(applicationId)}`,
      this.getHeaders()
    );
  }

  // ========================================
  // Get Contract PDF URL
  // ========================================

  getContractPdfUrl(applicationId: string): string {
    const token = localStorage.getItem('th_token') || '';
    return `${this.baseUrl}${API_ENDPOINTS.APPLICATIONS.CONTRACT_PDF(applicationId, token)}`;
  }
}
