import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { JobPost } from '../models/jobpost.model';

@Injectable({
  providedIn: 'root',
})
export class JobpostService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /* =========================
     RECRUITER
  ========================= */

  createJobPost(data: JobPost): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/jobpost/create`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateJobPost(jobPostId: string, data: JobPost): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/jobpost/${jobPostId}/update`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  closeJobPost(jobPostId: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/jobpost/${jobPostId}/close`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  reopenJobPost(jobPostId: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/jobpost/${jobPostId}/reopen`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteJobPost(jobPostId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/jobpost/${jobPostId}/delete`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getMyJobPosts(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getClosedJobs(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts/closed`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getRecruiterJobPostById(jobPostId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobpost/${jobPostId}/jobPost-details`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =========================
     APPLICANTS
  ========================= */

  getApplicantsSummary(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts/applicants`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getJobsWithApplicants(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts/applicant-list`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getJobApplicants(jobPostId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobpost/${jobPostId}/applicant-list`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateApplicantStatus(
    jobPostId: string,
    jobSeekerId: string,
    status: 'Shortlisted' | 'Rejected'
  ): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/jobpost/${jobPostId}/applicants/${jobSeekerId}/status`,
        { status },
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
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
}

