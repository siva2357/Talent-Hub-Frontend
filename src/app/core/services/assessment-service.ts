import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {

  private baseUrl = `${environment.apiGatewayUrl}/assessment`;

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

  /* =========================
     RECRUITER APIs
  ========================= */

  /** Create / assign assessment */
  createAssessment(payload: {
    jobPostId: string;
    jobSeekerId: string;
    assessmentLink?: string;
  }): Observable<any> {
    return this.http.post(
      this.baseUrl,
      payload,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /** Update assessment (link / notes / status) */
  updateAssessment(
    assessmentId: string,
    payload: {
      assessmentLink?: string;
      status?: 'Assigned' | 'Reviewed';
    }
  ): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/${assessmentId}`,
      payload,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /** Delete assessment */
  deleteAssessment(assessmentId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${assessmentId}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /* =========================
     JOB SEEKER APIs
  ========================= */

  /** Get my assessments */
  getMyAssessments(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/my`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /** Mark assessment as completed */
  markCompleted(assessmentId: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/complete/${assessmentId}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /* =========================
     ERROR HANDLER
  ========================= */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Server unreachable';
    }

    return throwError(() => message);
  }
}
