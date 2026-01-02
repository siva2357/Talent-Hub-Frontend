import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Projects, CreatePortfolioPayload, UpdatePortfolioPayload, PortfolioResponse, GetPortfoliosResponse } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root',
})

export class PortfolioService {
  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ✅ CREATE Portfolio
  createProjectUpload(payload: CreatePortfolioPayload): Observable<PortfolioResponse> {
    return this.http
      .post<PortfolioResponse>(`${this.baseUrl}/project`, payload, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ GET All Portfolios (logged-in job seeker)
  getProjects(): Observable<GetPortfoliosResponse> {
    return this.http
      .get<GetPortfoliosResponse>(`${this.baseUrl}/projects`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ GET Portfolio By ID
  getProjectById(projectId: string): Observable<Projects> {
    return this.http
      .get<Projects>(`${this.baseUrl}/project/${projectId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ✅ UPDATE Portfolio
  updateProjectById(
    projectId: string,
    payload: UpdatePortfolioPayload
  ): Observable<PortfolioResponse> {
    return this.http
      .put<PortfolioResponse>(`${this.baseUrl}/project/${projectId}/update`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // ✅ DELETE Portfolio
  deleteProjectById(projectId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/project/${projectId}/delete`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // ✅ Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
}
