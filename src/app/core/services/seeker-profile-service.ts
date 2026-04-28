import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import { ApiResponse } from '../models/api-response.model';
import { CreateJobSeekerProfileDTO, UpdateJobSeekerBasicDTO, UpdateJobSeekerImageDTO, UpdateJobSeekerProfessionalDTO } from '../dtos/jobseeker-profile.dto';
import { JobSeekerBasicProfile, JobSeekerImage, JobSeekerProfile, JobSeekerProfileResponse } from '../models/jobseeker-profile.model';
import { StorageService } from './storage.service';



@Injectable({ providedIn: 'root' })
export class SeekerProfileService {
  private readonly baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient, private router: Router,private storage: StorageService) {}

  /* ================= AUTH HEADER ================= */


  /* ================= HEADERS ================= */
  private getHeaders(): HttpHeaders {
    const token = this.storage.get('JWT_Token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /* ================= CREATE PROFILE ================= */

  createProfile(
    payload: CreateJobSeekerProfileDTO
  ): Observable<ApiResponse<JobSeekerProfile>> {
    return this.http
      .post<ApiResponse<JobSeekerProfile>>(
        `${this.baseUrl}/jobSeeker/createProfile`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= FULL PROFILE ================= */

  getJobSeekerProfile(): Observable<
    ApiResponse<JobSeekerProfileResponse>
  > {
    return this.http
      .get<ApiResponse<JobSeekerProfileResponse>>(
        `${this.baseUrl}/jobSeeker/getProfile`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= BASIC PROFILE ================= */

  getJobSeekerBasicDetails(): Observable<
    ApiResponse<JobSeekerBasicProfile>
  > {
    return this.http
      .get<ApiResponse<JobSeekerBasicProfile>>(
        `${this.baseUrl}/jobSeeker/basic`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  updateJobSeekerBasicDetails(
    payload: UpdateJobSeekerBasicDTO
  ): Observable<ApiResponse<JobSeekerProfile>> {
    return this.http
      .put<ApiResponse<JobSeekerProfile>>(
        `${this.baseUrl}/jobSeeker/basic`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= PROFILE IMAGE ================= */

  getJobSeekerProfilePicture(): Observable<
    ApiResponse<JobSeekerImage>
  > {
    return this.http
      .get<ApiResponse<JobSeekerImage>>(
        `${this.baseUrl}/jobSeeker/image`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  updateJobSeekerProfilePicture(
    payload: UpdateJobSeekerImageDTO
  ): Observable<ApiResponse<JobSeekerProfile>> {
    return this.http
      .put<ApiResponse<JobSeekerProfile>>(
        `${this.baseUrl}/jobSeeker/image`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= PROFESSIONAL ================= */

  getJobSeekerProfessional(): Observable<
    ApiResponse<JobSeekerProfile>
  > {
    return this.http
      .get<ApiResponse<JobSeekerProfile>>(
        `${this.baseUrl}/jobSeeker/professional`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  updateJobSeekerProfessional(
    payload: UpdateJobSeekerProfessionalDTO
  ): Observable<ApiResponse<JobSeekerProfile>> {
    return this.http
      .put<ApiResponse<JobSeekerProfile>>(
        `${this.baseUrl}/jobSeeker/professional`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* ================= DELETE ACCOUNT ================= */

  deleteJobSeekerAccount(): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(
        `${this.baseUrl}/jobSeeker/delete-account`,
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
