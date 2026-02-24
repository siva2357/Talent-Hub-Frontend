import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppliedJobsResponse, JobApplicantsResponse, JobPost, JobSeekerJobPost, RecruiterJobsResponse, SavedJobsResponse } from '../models/jobpost.model';
import { CreateJobPostDTO, UpdateJobPostDTO } from '../dtos/job-post.dto';

@Injectable({
  providedIn: 'root',
})
export class JobpostService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /* =========================
     RECRUITER
  ========================= */
  createJobPost(
    payload: CreateJobPostDTO
  ): Observable<{ message: string; jobPost: JobPost }> {
    return this.http
      .post<{ message: string; jobPost: JobPost }>(
        `${this.baseUrl}/jobpost/create`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  updateJobPost(
    jobPostId: string,
    payload: UpdateJobPostDTO
  ): Observable<{ message: string; jobPost: JobPost }> {
    return this.http
      .put<{ message: string; jobPost: JobPost }>(
        `${this.baseUrl}/jobpost/${jobPostId}/update`,
        payload,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  closeJobPost(jobPostId: string): Observable<{ message: string; jobPost: JobPost }> {
    return this.http
      .put<{ message: string; jobPost: JobPost }>(
        `${this.baseUrl}/jobpost/${jobPostId}/close`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  reopenJobPost(jobPostId: string): Observable<{ message: string; jobPost: JobPost }> {
    return this.http
      .put<{ message: string; jobPost: JobPost }>(
        `${this.baseUrl}/jobpost/${jobPostId}/reopen`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  deleteJobPost(jobPostId: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(
        `${this.baseUrl}/jobpost/${jobPostId}/delete`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }






  getMyJobPosts(): Observable<RecruiterJobsResponse> {
    return this.http
      .get<RecruiterJobsResponse>(
        `${this.baseUrl}/jobposts`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getRecruiterJobPostById(
    jobPostId: string
  ): Observable<{ jobPost: JobPost }> {
    return this.http
      .get<{ jobPost: JobPost }>(
        `${this.baseUrl}/jobpost/${jobPostId}/jobPost-details`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }



  /* =========================
     APPLICANTS
  ========================= */
  getApplicantsSummary(): Observable<{
    totalJobs: number;
    jobs: {
      _id: string;
      jobId: string;
      jobTitle: string;
      jobCategory: string;
      jobType: string;
      jobDescription: string;
      location: string;
      totalApplicants: number;
    }[];
  }> {
    return this.http
      .get<any>(
        `${this.baseUrl}/jobposts/applicants`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  getJobApplicants(jobPostId: string): Observable<JobApplicantsResponse> {
    return this.http
      .get<JobApplicantsResponse>(
        `${this.baseUrl}/jobpost/${jobPostId}/applicant-list`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  getAllJobPosts(): Observable<{
    totalJobs: number;
    jobs: JobSeekerJobPost[];
  }> {
    return this.http
      .get<{
        totalJobs: number;
        jobs: JobSeekerJobPost[];
      }>(
        `${this.baseUrl}/jobSeeker/jobs`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }



getJobPostById(
    jobPostId: string
  ): Observable<{ jobDetails: JobSeekerJobPost }> {
    return this.http
      .get<{ jobDetails: JobSeekerJobPost }>(
        `${this.baseUrl}/jobSeeker/job/${jobPostId}/details`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }


  applyJobPost(jobPostId: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(
        `${this.baseUrl}/jobSeeker/job/apply`,
        { jobPostId },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  withdrawJobPost(jobPostId: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .request<{ success: boolean; message: string }>(
        'DELETE',
        `${this.baseUrl}/jobSeeker/job/withdraw`,
        {
          headers: this.getHeaders(),
          body: { jobPostId }
        }
      )
      .pipe(catchError(this.handleError));
  }


  getAppliedJobPosts(): Observable<AppliedJobsResponse> {
    return this.http
      .get<AppliedJobsResponse>(
        `${this.baseUrl}/jobSeeker/jobs/applied`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  saveJobPost(jobPostId: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .post<{ success: boolean; message: string }>(
        `${this.baseUrl}/jobSeeker/job/save`,
        { jobPostId },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  unsaveJobPost(jobPostId: string): Observable<{ success: boolean; message: string }> {
    return this.http
      .request<{ success: boolean; message: string }>(
        'DELETE',
        `${this.baseUrl}/jobSeeker/job/unsave`,
        {
          headers: this.getHeaders(),
          body: { jobPostId }
        }
      )
      .pipe(catchError(this.handleError));
  }

  getSavedJobPosts(): Observable<SavedJobsResponse> {
    return this.http
      .get<SavedJobsResponse>(
        `${this.baseUrl}/jobSeeker/jobs/saved`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }



hireApplicant(jobPostId: string, jobSeekerId: string): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/job/${jobPostId}/hire/${jobSeekerId}`,
    {},
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}


rejectApplicant(jobPostId: string, jobSeekerId: string): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/job/${jobPostId}/reject/${jobSeekerId}`,
    {},
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
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

