import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecruiterProfile } from '../models/recruiter-profile.model';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
@Injectable({
  providedIn: 'root'
})
export class RecruiterProfileService {
  private baseUrl: string = environment.apiGatewayUrl;

  private role = localStorage.getItem('userRole') || '';
  private userData = JSON.parse(localStorage.getItem('userData') || '{}');

  private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error("🚨 No token found in localStorage!");
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }


  constructor(private http: HttpClient, private router: Router) { }

  createProfile(payload: any) {
    return this.http.post(`${this.baseUrl}/recruiter/createProfile`, payload);
  }

getRecruiterProfile(): Observable<ApiResponse<RecruiterProfile>> {
  return this.http
    .get<ApiResponse<RecruiterProfile>>(
      `${this.baseUrl}/recruiter/getProfile`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



getRecruiterBasicDetails(): Observable<ApiResponse<RecruiterProfile>> {
  return this.http
    .get<ApiResponse<RecruiterProfile>>(
      `${this.baseUrl}/recruiter/basic`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



updateRecruiterBasicDetails(payload: Partial<RecruiterProfile>):
  Observable<ApiResponse<RecruiterProfile>> {

  return this.http
    .put<ApiResponse<RecruiterProfile>>(
      `${this.baseUrl}/recruiter/basic`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



/* ================= PROFILE IMAGE ================= */

getRecruiterProfilePicture(): Observable<{ success: boolean; data: { profilePhoto: string } }> {
  return this.http
    .get<{ success: boolean; data: { profilePhoto: string } }>(
      `${this.baseUrl}/recruiter/image`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}


updateRecruiterProfilePicture(
  profilePhoto: string
): Observable<{ success: boolean; data: any }> {

  return this.http
    .put<{ success: boolean; data: any }>(
      `${this.baseUrl}/recruiter/image`,
      { profilePhoto },
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



getRecruiterProfessional(): Observable<ApiResponse<RecruiterProfile>> {
  return this.http
    .get<ApiResponse<RecruiterProfile>>(
      `${this.baseUrl}/recruiter/professional`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}

updateRecruiterProfessional(
  payload: Partial<RecruiterProfile>
): Observable<ApiResponse<RecruiterProfile>> {

  return this.http
    .put<ApiResponse<RecruiterProfile>>(
      `${this.baseUrl}/recruiter/professional`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}


deleteRecruiterAccount(): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/recruiter/delete-account`,
    {
      headers: this.getHeaders()
    }
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
    return throwError(errorMessage);
  }

}
