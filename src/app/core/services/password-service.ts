import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ChangePassword } from '../models/password.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  /* ================= JWT HEADER ================= */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* =====================================================
     🔐 CHANGE PASSWORD (LOGGED-IN USER)
     ===================================================== */
  changePassword(payload: ChangePassword): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/auth/change-password`,
      payload,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(err => this.handleError(err)));
  }

  /* =====================================================
     🔁 FORGOT PASSWORD FLOW (NO JWT)
     ===================================================== */

  // Step 1: Send OTP
  sendForgotPasswordCode(email: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/forgot-password-code`,
      { email }
    ).pipe(catchError(err => this.handleError(err)));
  }

  // Step 2: Verify OTP
  verifyForgotPasswordCode( providedCode: string,email: string,): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/verify-forgotPassword-code`,
      { email, providedCode }
    ).pipe(catchError(err => this.handleError(err)));
  }

  // Step 3: Reset Password
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/auth/reset-password`,
      { email, newPassword }
    ).pipe(catchError(err => this.handleError(err)));
  }

  /* ================= ERROR HANDLER ================= */
  private handleError(error: any) {
    console.error('🔥 Password API Error:', error);

    if (error.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }

    return throwError(() => error?.error || error);
  }
}
