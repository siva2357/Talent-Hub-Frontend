import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { JobSeekerProfile, JobSeekerProfileResponse } from '../models/jobseeker-profile.model';

@Injectable({
  providedIn: 'root',
})
export class SeekerProfileService  {
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
  return this.http.post(
    `${this.baseUrl}/jobSeeker/createProfile`,
    payload,
    {
      headers: this.getHeaders()
    }
  )
    .pipe(catchError(error => this.handleError(error)));
}


getJobSeekerProfile(): Observable<ApiResponse<JobSeekerProfileResponse>> {
  return this.http
    .get<ApiResponse<JobSeekerProfileResponse>>(
      `${this.baseUrl}/jobSeeker/getProfile`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



getJobSeekerBasicDetails(): Observable<ApiResponse<JobSeekerProfile>> {
  return this.http
    .get<ApiResponse<JobSeekerProfile>>(
      `${this.baseUrl}/jobSeeker/basic`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



updateJobSeekerBasicDetails(payload: Partial<JobSeekerProfile>):
  Observable<ApiResponse<JobSeekerProfile>> {

  return this.http
    .put<ApiResponse<JobSeekerProfile>>(
      `${this.baseUrl}/jobSeeker/basic`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



/* ================= PROFILE IMAGE ================= */

getJobSeekerProfilePicture(): Observable<{ success: boolean; data: { profilePhoto: string } }> {
  return this.http
    .get<{ success: boolean; data: { profilePhoto: string } }>(
      `${this.baseUrl}/jobSeeker/image`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}


updateJobSeekerProfilePicture(
  profilePhoto: string
): Observable<{ success: boolean; data: any }> {

  return this.http
    .put<{ success: boolean; data: any }>(
      `${this.baseUrl}/jobSeeker/image`,
      { profilePhoto },
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}



getJobSeekerProfessional(): Observable<ApiResponse<JobSeekerProfile>> {
  return this.http
    .get<ApiResponse<JobSeekerProfile>>(
      `${this.baseUrl}/jobSeeker/professional`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}

updateJobSeekerProfessional(
  payload: Partial<JobSeekerProfile>
): Observable<ApiResponse<JobSeekerProfile>> {

  return this.http
    .put<ApiResponse<JobSeekerProfile>>(
      `${this.baseUrl}/jobSeeker/professional`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(error => this.handleError(error)));
}


deleteJobSeekerAccount(): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/jobSeeker/delete-account`,
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
