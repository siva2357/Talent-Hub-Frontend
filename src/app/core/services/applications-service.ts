import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ================= JOB SEEKER =================

  apply(jobPostId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/apply`,
      { jobPostId },
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  withdraw(jobPostId: string): Observable<any> {
    return this.http.request(
      'DELETE',
      `${this.baseUrl}/withdraw`,
      {
        headers: this.getHeaders(),
        body: { jobPostId }
      }
    ).pipe(catchError(this.handleError));
  }

  getAppliedJobs(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/applied`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }


getAppliedJobIds(): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/applied-ids`, // ✅ correct route
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}

  // ================= RECRUITER =================

  getApplicants(jobPostId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/job/${jobPostId}/applicants`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  hire(jobPostId: string, jobSeekerId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/job/${jobPostId}/hire/${jobSeekerId}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  reject(jobPostId: string, jobSeekerId: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/job/${jobPostId}/reject/${jobSeekerId}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
}
