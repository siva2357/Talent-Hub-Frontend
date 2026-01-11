import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {  HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CreateInterviewPayload, Interview } from '../models/interview.model';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {


  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ==================== RECRUITER ====================

createInterview(payload: CreateInterviewPayload): Observable<Interview> {
  return this.http
    .post<{ interview: Interview }>(
      `${this.baseUrl}/recruiter/meetings`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(
      map(res => res.interview),
      catchError(this.handleError)
    );
}


  getAllRecruiterInterviews(): Observable<{ totalInterviews: number; interviews: Interview[] }> {
    return this.http
      .get<{ totalMeetings: number; meetings: Interview[] }>(
        `${this.baseUrl}/recruiter/meetings`,
        { headers: this.getHeaders() }
      )
      .pipe(
        map(res => ({
          totalInterviews: res.totalMeetings,
          interviews: res.meetings
        })),
        catchError(this.handleError)
      );
  }


  getRecruiterInterviewById(id: string): Observable<Interview> {
    return this.http
      .get<{ interview: Interview }>(
        `${this.baseUrl}/recruiter/meetings/${id}`,
        { headers: this.getHeaders() }
      )
      .pipe(map(res => res.interview), catchError(this.handleError));
  }



updateInterview(
  interviewId: string,
  updateData: Partial<Interview>
): Observable<Interview> {
  return this.http
    .patch<{ interview: Interview }>(
      `${this.baseUrl}/recruiter/meetings/${interviewId}`,
      updateData,
      { headers: this.getHeaders() }
    )
    .pipe(
      map(res => res.interview),
      catchError(this.handleError)
    );
}


  deleteInterview(interviewId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(
        `${this.baseUrl}/recruiter/meetings/${interviewId}`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }



getInterviewByApplicant(
  jobPostId: string,
  jobSeekerId: string
): Observable<Interview> {
  return this.http.get<Interview>(
    `${this.baseUrl}/recruiter/interview/by-applicant`,
    {
      headers: this.getHeaders(),
      params: { jobPostId, jobSeekerId }
    }
  );
}





  getAllJobSeekerInterviews(): Observable<{ totalInterviews: number; interviews: Interview[] }> {
    return this.http
      .get<{ totalMeetings: number; meetings: Interview[] }>(
        `${this.baseUrl}/jobseeker/meetings`,
        { headers: this.getHeaders() }
      )
      .pipe(
        map(res => ({
          totalInterviews: res.totalMeetings,
          interviews: res.meetings
        })),
        catchError(this.handleError)
      );
  }


  getJobSeekerInterviewById(id: string): Observable<Interview> {
    return this.http
      .get<{ interview: Interview }>(
        `${this.baseUrl}/jobseeker/meetings/${id}`,
        { headers: this.getHeaders() }
      )
      .pipe(map(res => res.interview), catchError(this.handleError));
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
