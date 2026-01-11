import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssessmentReport, GetCodingQuestionsResponse } from '../models/assessment.model';
@Injectable({
  providedIn: 'root',
})
export class AssessmentService {

private baseUrl: string = `${environment.apiGatewayUrl}/assessment`;


  constructor(private http: HttpClient) {}
  /* =========================
     HEADERS
  ========================= */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error('🚨 JWT token missing');
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }



assignAssessment(payload: {
  jobPostId: string;
  jobSeekerId: string;
}): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/assign`,
    payload,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}


getAssessmentIdByJob(jobPostId: string, jobSeekerId: string) {
  return this.http.get<{ assessmentId: string }>(
    `${this.baseUrl}/by-job/${jobPostId}/${jobSeekerId}`,
    { headers: this.getHeaders() }
  );
}



getAssessmentReport(assessmentId: string): Observable<AssessmentReport> {
  return this.http.get<AssessmentReport>(
    `${this.baseUrl}/report/${assessmentId}`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}




      getMyAssessments(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/my`,
      { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
  }

    getAssessmentMcqs(assessmentId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/take/${assessmentId}`,
      { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
  }


getCodingQuestion(
  assessmentId: string
): Observable<GetCodingQuestionsResponse> {
  return this.http.get<GetCodingQuestionsResponse>(
    `${this.baseUrl}/coding/${assessmentId}`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}





  /** Submit MCQ answers */
/** Submit assessment (MCQ + multiple coding) */
submitAssessment(payload: {
  assessmentId: string;
  mcqAnswers: {
    questionId: string;
    selectedOption: number;
  }[];
  coding?: {
    questionId: string;
    language: string;
    code: string;
  }[];
}): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/submit`,
    payload,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
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

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

}
