import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { JobMatchResponse } from '../models/jobMatchReponse.model';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {

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


 getJobResumeMatch(id: string): Observable<JobMatchResponse> {
    return this.http
      .get<JobMatchResponse>(
        `${this.baseUrl}/job/${id}/match`,
        { headers: this.getHeaders() }   // ✅ HEADERS USED
      )
      .pipe(
        catchError(this.handleError)     // ✅ ERROR HANDLED
      );
  }


  getRecommendedJobs(id: string): Observable<any> {
    return this.http
      .get<any>(
        `${this.baseUrl}/job/${id}/recommended`,
        { headers: this.getHeaders() }   // ✅ HEADERS USED
      )
      .pipe(
        catchError(this.handleError)     // ✅ ERROR HANDLED
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
