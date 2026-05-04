import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {  HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Interview, JobSeekerInterview, MeetingsResponse } from '../models/interview.model';
import { CreateInterviewDTO, UpdateInterviewDTO } from '../dtos/interview.dto';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private baseUrl = environment.apiGatewayUrl;

  constructor(
    private http: HttpClient,) {}

  /* ================= HEADERS ================= */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // ==================== RECRUITER ====================

  createInterview(payload: CreateInterviewDTO): Observable<Interview> {
    return this.http
      .post<{
        success: boolean;
        interview: Interview;
      }>(`${this.baseUrl}/recruiter/meetings`, payload, { headers: this.getHeaders() })
      .pipe(
        map((res) => res.interview),
        catchError(this.handleError),
      );
  }

  getAllRecruiterInterviews(): Observable<MeetingsResponse> {
    return this.http
      .get<MeetingsResponse>(`${this.baseUrl}/recruiter/meetings`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateInterview(interviewId: string, payload: UpdateInterviewDTO): Observable<Interview> {
    return this.http
      .put<{
        success: boolean;
        meeting: Interview;
      }>(`${this.baseUrl}/recruiter/meetings/${interviewId}`, payload, { headers: this.getHeaders() })
      .pipe(
        map((res) => res.meeting),
        catchError(this.handleError),
      );
  }

  deleteInterview(interviewId: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .delete<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/recruiter/meetings/${interviewId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  /** Get interview by applicant (jobPost + jobSeeker) */
  getInterviewByApplicant(jobPostId: string, jobSeekerId: string): Observable<Interview> {
    return this.http
      .get<Interview>(`${this.baseUrl}/recruiter/interview/by-applicant`, {
        headers: this.getHeaders(),
        params: { jobPostId, jobSeekerId },
      })
      .pipe(catchError(this.handleError));
  }

  getAllJobSeekerInterviews(): Observable<{
    totalMeetings: number;
    meetings: JobSeekerInterview[];
  }> {
    return this.http
      .get<{
        totalMeetings: number;
        meetings: JobSeekerInterview[];
      }>(`${this.baseUrl}/jobSeeker/meetings`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message || `Error ${error.status}: ${error.statusText}`;

    console.error('Interview API Error:', error);
    return throwError(() => message);
  }
}
