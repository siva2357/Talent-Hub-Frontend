import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Talent } from '../models/talent.model';
@Injectable({
  providedIn: 'root',
})
export class UserService {
 private baseUrl: string = environment.apiGatewayUrl;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  constructor(private http: HttpClient, private router: Router) { }


getAllTalents(): Observable<{ success: boolean; data: Talent[] }> {
  return this.http
    .get<{ success: boolean; data: Talent[] }>(
      `${this.baseUrl}/talents`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}


getTalentProfileById(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/talents/${id}/talent-profile`, { headers: this.getHeaders()}).pipe(catchError(error => this.handleError(error)));
}




  saveTalent(jobSeekerId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/save-talent`,
      { jobSeekerId },
      { headers: this.getHeaders() }
    ).pipe(catchError(err => this.handleError(err)));
  }

  unsaveTalent(jobSeekerId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/unsave-talents`,
      {
        headers: this.getHeaders(),
        body: { jobSeekerId }
      }
    ).pipe(catchError(err => this.handleError(err)));
  }

  getSavedTalents(): Observable<{ success: boolean; data: Talent[] }> {
    return this.http.get<{ success: boolean; data: Talent[] }>(
      `${this.baseUrl}/saved-talents`,
      { headers: this.getHeaders() }
    ).pipe(catchError(err => this.handleError(err)));
  }


getShortlistedTalents(
  jobPostId: string
): Observable<{ total: number;  data: Talent[] }> {

  return this.http
    .get<{ total: number;  data: Talent[] }>(
      `${this.baseUrl}/jobs/${jobPostId}/shortlisted-candidates`,
      { headers: this.getHeaders() }
    )
    .pipe(
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
    return throwError(errorMessage);
  }


}
