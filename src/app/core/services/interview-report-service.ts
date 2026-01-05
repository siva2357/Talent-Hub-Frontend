import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { InterviewReport, SubmitInterviewReportPayload } from '../models/interview-report.model';


@Injectable({
  providedIn: 'root'
})
export class InterviewReportService {

  private baseUrl = `${environment.apiGatewayUrl}/interview-reports`;

  constructor(private http: HttpClient) {}

  /* ==========================
     AUTH HEADERS
  ========================== */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* ==========================
     SUBMIT INTERVIEW REPORT
     Recruiter only
     POST /interview-reports/submit
  ========================== */
  submitInterviewReport(
    payload: SubmitInterviewReportPayload
  ): Observable<InterviewReport> {
    return this.http
      .post<{ report: InterviewReport }>(
        `${this.baseUrl}/submit`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(
        map(res => res.report),
        catchError(this.handleError)
      );
  }

  /* ==========================
     GET REPORT BY INTERVIEW ID
     GET /interview-reports/:interviewId
  ========================== */
  getInterviewReportByInterviewId(
    interviewId: string
  ): Observable<InterviewReport> {
    return this.http
      .get<{ report: InterviewReport }>(
        `${this.baseUrl}/${interviewId}`,
        { headers: this.getHeaders() }
      )
      .pipe(
        map(res => res.report),
        catchError(this.handleError)
      );
  }

  /* ==========================
     GET ALL REPORTS (RECRUITER)
     GET /interview-reports/recruiter/all
  ========================== */
  getRecruiterInterviewReports(): Observable<{
    total: number;
    reports: InterviewReport[];
  }> {
    return this.http
      .get<{ total: number; reports: InterviewReport[] }>(
        `${this.baseUrl}/recruiter/all`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ==========================
     ERROR HANDLER
  ========================== */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Something went wrong';
    if (error.error?.message) {
      message = error.error.message;
    }
    console.error('❌ InterviewReport API error:', error);
    return throwError(() => message);
  }
}
