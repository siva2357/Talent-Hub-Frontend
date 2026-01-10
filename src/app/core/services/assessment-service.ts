import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
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



  /** Assign MCQ assessment to a job seeker */
  assignAssessment(payload: {
    jobPostId: string;
    jobSeekerId: string;
    jobCategory: string;
    jobTitle: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/assign`,
      payload,
      { headers: this.getHeaders() }
    ) .pipe(catchError(this.handleError));
  }



    /** View MCQ report */
  getAssessmentReport(assessmentId: string): Observable<any> {
    return this.http.get(
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

  /** Submit MCQ answers */
submitAssessment(payload: {
  assessmentId: string;
  mcqAnswers: {
    questionId: string;
    selectedOption: number;
  }[];
  coding?: {
    language: string;
    code: string;
  };
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
