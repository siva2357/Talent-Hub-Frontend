import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  // ✅ FIXED BASE URL
  private baseUrl: string = `${environment.apiGatewayUrl}`;

  constructor(private http: HttpClient) {}

  /* =========================
     HEADERS
  ========================= */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

    getOverallAnalytics(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/analytics/overall`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =====================================================
     1️⃣ GET RECRUITER ANALYTICS JOBS
     GET /analytics/jobs
  ===================================================== */
  getRecruiterAnalyticsJobs(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/analytics/jobs`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =====================================================
     2️⃣ GET APPLICANTS FOR A JOB
     GET /analytics/job/:jobPostId/applicants
  ===================================================== */
  getJobAnalyticsApplicants(jobPostId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/analytics/job/${jobPostId}/applicants`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =====================================================
     3️⃣ GET APPLICANT ASSESSMENT REPORT
     GET /analytics/assessment/:jobPostId/:jobSeekerId
  ===================================================== */
  getApplicantAssessmentReport(
    jobPostId: string,
    jobSeekerId: string
  ): Observable<any> {
    return this.http
      .get(
        `${this.baseUrl}/analytics/assessment/${jobPostId}/${jobSeekerId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* =====================================================
     4️⃣ GET APPLICANT INTERVIEW REPORT
     GET /analytics/interview/:jobPostId/:jobSeekerId
  ===================================================== */
  getApplicantInterviewReport(
    jobPostId: string,
    jobSeekerId: string
  ): Observable<any> {
    return this.http
      .get(
        `${this.baseUrl}/analytics/interview/${jobPostId}/${jobSeekerId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* =====================================================
     5️⃣ HIRE APPLICANT
     PUT /analytics/job/:jobPostId/hire/:jobSeekerId
  ===================================================== */
  hireApplicant(jobPostId: string, jobSeekerId: string): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/analytics/job/${jobPostId}/hire/${jobSeekerId}`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* =====================================================
     6️⃣ REJECT APPLICANT
     PUT /analytics/job/:jobPostId/reject/:jobSeekerId
  ===================================================== */
  rejectApplicant(jobPostId: string, jobSeekerId: string): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/analytics/job/${jobPostId}/reject/${jobSeekerId}`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* =========================
     ERROR HANDLER
  ========================= */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Server unreachable. Check your connection.';
    }

    console.error('Analytics API Error:', error);
    return throwError(() => errorMessage);
  }
}
