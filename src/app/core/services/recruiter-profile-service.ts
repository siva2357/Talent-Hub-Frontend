import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

/* ================= MODELS ================= */
import { ApiResponse } from '../models/api-response.model';
import { CreateRecruiterProfileDTO, UpdateRecruiterBasicDTO, UpdateRecruiterImageDTO, UpdateRecruiterProfessionalDTO } from '../dtos/recruiter-profile.dto';
import { RecruiterBasicProfile, RecruiterImage, RecruiterProfessionalProfile, RecruiterProfile, RecruiterProfileWithJobsResponse, UpdateRecruiterResponse } from '../models/recruiter-profile.model';



@Injectable({ providedIn: 'root' })
export class RecruiterProfileService {
  private readonly baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient, private router: Router) {}

  /* ================= AUTH HEADER ================= */

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  /* ================= CREATE PROFILE ================= */

  createProfile(
    payload: CreateRecruiterProfileDTO
  ): Observable<ApiResponse<RecruiterProfile>> {
    return this.http
      .post<ApiResponse<RecruiterProfile>>(
        `${this.baseUrl}/recruiter/createProfile`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= FULL PROFILE ================= */

getRecruiterProfile(): Observable<
  ApiResponse<RecruiterProfileWithJobsResponse>
> {
  return this.http.get<ApiResponse<RecruiterProfileWithJobsResponse>>(
    `${this.baseUrl}/recruiter/getProfile`,
    { headers: this.getHeaders() }
  );
}


  /* ================= BASIC PROFILE ================= */
getRecruiterBasicDetails(): Observable<
  ApiResponse<RecruiterBasicProfile>
> {
  return this.http.get<ApiResponse<RecruiterBasicProfile>>(
    `${this.baseUrl}/recruiter/basic`,
    { headers: this.getHeaders() }
  );
}

updateRecruiterBasicDetails(
  payload: UpdateRecruiterBasicDTO
): Observable<UpdateRecruiterResponse<RecruiterBasicProfile>> {
  return this.http.put<UpdateRecruiterResponse<RecruiterBasicProfile>>(
    `${this.baseUrl}/recruiter/basic`,
    payload,
    { headers: this.getHeaders() }
  );
}


  /* ================= PROFILE IMAGE ================= */
getRecruiterProfilePicture(): Observable<
  ApiResponse<RecruiterImage>
> {
  return this.http.get<ApiResponse<RecruiterImage>>(
    `${this.baseUrl}/recruiter/image`,
    { headers: this.getHeaders() }
  );
}

updateRecruiterProfilePicture(
  payload: UpdateRecruiterImageDTO
): Observable<UpdateRecruiterResponse<RecruiterImage>> {
  return this.http.put<UpdateRecruiterResponse<RecruiterImage>>(
    `${this.baseUrl}/recruiter/image`,
    payload,
    { headers: this.getHeaders() }
  );
}

  /* ================= PROFESSIONAL ================= */

getRecruiterProfessional(): Observable<
  ApiResponse<RecruiterProfessionalProfile>
> {
  return this.http.get<ApiResponse<RecruiterProfessionalProfile>>(
    `${this.baseUrl}/recruiter/professional`,
    { headers: this.getHeaders() }
  );
}

updateRecruiterProfessional(
  payload: UpdateRecruiterProfessionalDTO
): Observable<UpdateRecruiterResponse<RecruiterProfessionalProfile>> {
  return this.http.put<UpdateRecruiterResponse<RecruiterProfessionalProfile>>(
    `${this.baseUrl}/recruiter/professional`,
    payload,
    { headers: this.getHeaders() }
  );
}


  /* ================= DELETE ACCOUNT ================= */

  deleteRecruiterAccount(): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(
        `${this.baseUrl}/recruiter/delete-account`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= ERROR HANDLER ================= */

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message =
      error.error?.message ||
      `Error ${error.status}: ${error.statusText}`;
    return throwError(() => message);
  }
}
