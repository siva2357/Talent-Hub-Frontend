import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateJobPostDTO, UpdateJobPostDTO } from '../dtos/job-post.dto';
import { JobDetailResponse, RecruiterJobsResponse } from '../models/jobpost.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class JobpostService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  /* ================= HEADERS ================= */
  private getHeaders(): HttpHeaders {
    const token = this.storage.get('JWT_Token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }
  // ================= RECRUITER =================

  createJobPost(payload: any) {
    return this.http.post(`${this.baseUrl}/jobpost/create`, payload, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateJobPost(jobPostId: string, payload: UpdateJobPostDTO) {
    return this.http.put(`${this.baseUrl}/jobpost/${jobPostId}/update`, payload, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  closeJobPost(jobPostId: string) {
    return this.http.put(`${this.baseUrl}/jobpost/${jobPostId}/close`, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  reopenJobPost(jobPostId: string) {
    return this.http.put(`${this.baseUrl}/jobpost/${jobPostId}/reopen`, {}, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteJobPost(jobPostId: string) {
    return this.http.delete(`${this.baseUrl}/jobpost/${jobPostId}/delete`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getMyJobPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/jobposts`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

getRecruiterJobPostById(jobPostId: string): Observable<JobDetailResponse> {
  return this.http.get<JobDetailResponse>(
    `${this.baseUrl}/jobpost/${jobPostId}/jobPost-details`,
    { headers: this.getHeaders() }
  );
}

  getApplicantsSummary() {
    return this.http.get(`${this.baseUrl}/jobposts/applicants`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ================= JOB SEEKER =================

  getAllJobPosts() {
    return this.http.get(`${this.baseUrl}/jobSeeker/jobs`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  getJobPostById(jobPostId: string) {
    return this.http.get(`${this.baseUrl}/jobSeeker/job/${jobPostId}/details`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  saveJobPost(jobPostId: string) {
    return this.http.post(`${this.baseUrl}/jobSeeker/job/save`, { jobPostId }, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  unsaveJobPost(jobPostId: string) {
    return this.http.request('DELETE',
      `${this.baseUrl}/jobSeeker/job/unsave`,
      {
        headers: this.getHeaders(),
        body: { jobPostId }
      }
    ).pipe(catchError(this.handleError));
  }

  getSavedJobPosts() {
    return this.http.get(`${this.baseUrl}/jobSeeker/jobs/saved`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

}

