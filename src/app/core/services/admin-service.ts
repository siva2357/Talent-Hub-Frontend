import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private baseUrl: string = `${environment.apiGatewayUrl}`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* ================= HEADERS ================= */

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    if (token) {
      const decodedToken: any = jwtDecode(token); // optional use
    }

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /* ================= AUTH ================= */

  isLoggedIn(): boolean {
    return !!localStorage.getItem('JWT_Token'); // 🔥 FIXED KEY ALSO
  }

  /* ================= ERROR HANDLER ================= */

  private handleError(error: any): Observable<never> {
    console.error('🔥 API Error:', error);

    if (error.status === 401) {
      alert('❌ Unauthorized! Please log in again.');

      localStorage.clear(); // ✅ SSR safe

      // ✅ SSR SAFE redirect
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = '/login';
      }
    }

    return throwError(() => new Error(error.message || 'API Error'));
  }

  /* ================= APIs ================= */

  getAllRecruiters(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/recruiters-list`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getRecruiterProfileById(userId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/recruiters/${userId}/profile`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllJobSeekers(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobSeekers-list`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getJobSeekerProfileById(userId: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/jobSeekers/${userId}/profile`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAdminById(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/admin/profile`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }
}
