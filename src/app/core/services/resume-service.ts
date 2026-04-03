import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {

  private baseUrl: string = `${environment.apiGatewayUrl}`;
  private apiUrl: string = environment.generativeAIUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    if (!token) {
      throw new Error('No auth token found');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // 🔹 AI analyze
  analyzeResume(url: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/resume/analyze`,
      { url }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

// 🔹 CREATE resume
saveResume(payload: any): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/resume/create`,
    payload,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}

updateAnalysis(id: string, payload: any) {
  return this.http.put(
    `${this.baseUrl}/resume/analysis/${id}`,
    payload,
    { headers: this.getHeaders() }
  );
}

// 🔹 GET ALL resumes
getResumes(): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/resume/list`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}

// 🔹 GET ONE resume
getResumeById(id: string): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/resume/detail/${id}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}

// 🔹 DELETE resume
deleteResume(id: string): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/resume/delete/${id}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => errorMessage);
  }
}
