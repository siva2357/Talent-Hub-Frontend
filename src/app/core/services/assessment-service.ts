import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateAssessmentDTO, UpdateAssessmentDTO } from '../dtos/assessment.dto';
import { MyAssessment } from '../models/assessment.model';

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
  createAssessment(
    payload: CreateAssessmentDTO
  ): Observable<{ message: string; assessmentId: string }> {
    return this.http
      .post<{ message: string; assessmentId: string }>(
        this.baseUrl,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

/** Get all assessments created by recruiter */
getRecruiterAssessments(): Observable<any[]> {
  return this.http
    .get<any[]>(
      `${this.baseUrl}/recruiter`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(this.handleError));
}

  /** Update assessment (link / notes / status) */
  /** Update assessment link (ONLY link allowed) */
updateAssessment(
  assessmentId: string,
  payload: any
) {
  return this.http.patch(
    `${this.baseUrl}/${assessmentId}`, // ✅ MUST match route
    payload,
    { headers: this.getHeaders() }
  );
}
  /** Delete assessment */
  deleteAssessment(
    assessmentId: string
  ): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(
        `${this.baseUrl}/${assessmentId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  /* =========================
     JOB SEEKER APIs
  ========================= */

  /** Get my assessments */
 /** Get my assigned assessments */
  getMyAssessments(): Observable<MyAssessment[]> {
    return this.http
      .get<MyAssessment[]>(
        `${this.baseUrl}/my`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /** Mark assessment as completed */
  markCompleted(
    assessmentId: string
  ): Observable<{ message: string }> {
    return this.http
      .patch<{ message: string }>(
        `${this.baseUrl}/complete/${assessmentId}`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* =========================
     ERROR HANDLER
  ========================= */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.error?.message ||
      (error.status === 0
        ? 'Server unreachable'
        : `Error ${error.status}`);

    console.error('Assessment API Error:', error);
    return throwError(() => message);
  }
}
