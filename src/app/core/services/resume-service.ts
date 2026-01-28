import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private baseUrl: string = environment.apiGatewayUrl;

  private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error("🚨 No token found in localStorage!");
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  constructor(private http: HttpClient) { }

  getMyResumes(): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/my-resumes`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}


runResumeScoring(resumeId: string, force: boolean = false): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/resume/${resumeId}/score${force ? '?force=true' : ''}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}

getResumeReport(resumeId: string): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/resume/${resumeId}/report`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}


deleteResume(resumeId: string): Observable<any> {
  return this.http.delete<any>(
    `${this.baseUrl}/resume/${resumeId}/delete`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}


  saveResumeUrl(resumeUrl: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/resume/resume-url`, { resumeUrl }, { headers: this.getHeaders() })
  .pipe(catchError(error => this.handleError(error)));;
}



  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
