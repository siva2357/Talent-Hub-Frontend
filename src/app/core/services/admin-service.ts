import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode' ;
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl: string = `${environment.apiGatewayUrl}`;
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
    }

    if (!token) {
      console.error('🚨 No token found in localStorage!');
      return new HttpHeaders();
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: any): Observable<never> {
    console.error('🔥 API Error:', error);
    if (error.status === 401) {
      alert('❌ Unauthorized! Please log in again.');
      localStorage.clear();
      window.location.href = '/login';
    }
    return throwError(() => new Error(error.message || 'API Error'));
  }

  getAllRecruiters(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/recruiters/pending`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getRecruiterProfileById(userId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/recruiters/${userId}/profile`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllJobSeekers(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/job-seekers/pending`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getJobSeekerProfileById(userId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/job-seekers/${userId}/profile`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

approveUser(data: { userId: string; role: string }): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/users/approve`,
    data,
    { headers: this.getHeaders() }
  ).pipe(catchError(error => this.handleError(error)));
}




rejectUser(data: { userId: string; role: string }): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/users/reject`,
    data,
    { headers: this.getHeaders() }
  ).pipe(catchError(error => this.handleError(error)));
}


uploadMcqs(formData: FormData): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/upload-file`,formData,
    { headers: this.getHeaders() }
  ).pipe(catchError(error => this.handleError(error)));
}


}
