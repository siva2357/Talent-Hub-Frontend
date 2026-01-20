import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppliedJobsResponse, JobPost, SavedJobs } from '../models/jobpost.model';

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

  createJobPost(data: JobPost): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/jobpost/create`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateJobPost(jobPostId: string, data: JobPost): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/jobpost/${jobPostId}/update`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  closeJobPost(jobPostId: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/jobpost/${jobPostId}/close`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  reopenJobPost(jobPostId: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/jobpost/${jobPostId}/reopen`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteJobPost(jobPostId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/jobpost/${jobPostId}/delete`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getMyJobPosts(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getClosedJobs(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts/closed`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getRecruiterJobPostById(jobPostId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobpost/${jobPostId}/jobPost-details`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =========================
     APPLICANTS
  ========================= */

  getApplicantsSummary(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts/applicants`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getJobsWithApplicants(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobposts/applicant-list`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getJobApplicants(jobPostId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobpost/${jobPostId}/applicant-list`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateApplicantStatus(
    jobPostId: string,
    jobSeekerId: string,
    status: 'Shortlisted' | 'Rejected'
  ): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/jobpost/${jobPostId}/applicants/${jobSeekerId}/status`,
        { status },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }






getAllJobPosts(): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/jobSeeker/jobs`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}




  getJobPostById(jobPostId: string): Observable<any> {
  return this.http.get<any>(
    `${this.baseUrl}/jobSeeker/job/${jobPostId}/details`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}



applyJobPost(jobPostId: string): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/jobSeeker/job/apply`,
    { jobPostId },
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}


withdrawJobPost(jobPostId: string): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/jobSeeker/job/withdraw`,
    {
      headers: this.getHeaders(),
      body: { jobPostId }
    }
  ).pipe(catchError(this.handleError));
}


getAppliedJobPosts(): Observable<AppliedJobsResponse> {
  return this.http.get<AppliedJobsResponse>(
    `${this.baseUrl}/jobSeeker/jobs/applied`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}


isJobPostApplied(jobPostId: string): Observable<{ isApplied: boolean }> {
  return this.http.get<{ isApplied: boolean }>(
    `${this.baseUrl}/jobSeeker/job/is-applied/${jobPostId}`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}




saveJobPost(jobPostId: string): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/jobSeeker/job/save`,
    { jobPostId },
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}


unsaveJobPost(jobPostId: string): Observable<any> {
  return this.http.request(
    'DELETE',
    `${this.baseUrl}/jobSeeker/job/unsave`,
    {
      headers: this.getHeaders(),
      body: { jobPostId }
    }
  ).pipe(catchError(this.handleError));
}


getSavedJobPosts(): Observable<SavedJobs> {
  return this.http.get<SavedJobs>(
    `${this.baseUrl}/jobSeeker/jobs/saved`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}


getJobPosts(): Observable<AppliedJobsResponse> {
  return this.http.get<AppliedJobsResponse>(
    `${this.baseUrl}/jobsSeeker/my-jobposts`,
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}







/** Shortlist (Hire) applicant */
hireApplicant(jobPostId: string, jobSeekerId: string): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/analytics/job/${jobPostId}/hire/${jobSeekerId}`,
    {},
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}

/** Reject applicant */
rejectApplicant(jobPostId: string, jobSeekerId: string): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/analytics/job/${jobPostId}/reject/${jobSeekerId}`,
    {},
    { headers: this.getHeaders() }
  ).pipe(catchError(this.handleError));
}



  /* =========================
     ERROR HANDLER
  ========================= */

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
}

