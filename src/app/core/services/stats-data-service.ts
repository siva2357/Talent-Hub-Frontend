import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AdminStatsResponse, JobSeekerStatsResponse, RecruiterStatsResponse } from '../models/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class StatsDataService {

    private baseUrl: string = environment.apiGatewayUrl;
  constructor(private http: HttpClient, private router: Router) { }

    private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error("🚨 No token found in localStorage!");
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAdminStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(
      `${this.baseUrl}/admin/stats`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

    getRecruiterStats(): Observable<RecruiterStatsResponse> {
    return this.http.get<RecruiterStatsResponse>(
      `${this.baseUrl}/recruiter/stats`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

    getJobSeekerStats(): Observable<JobSeekerStatsResponse> {
    return this.http.get<JobSeekerStatsResponse>(
      `${this.baseUrl}/jobSeeker/stats`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => this.handleError(error))
    );
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
