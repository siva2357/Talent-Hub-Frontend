import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { LoginRequestDto } from '../dtos/login.dto';
import { LoginResponse, LogoutResponse } from '../models/auth.model';
import { SignupRequestDto } from '../dtos/signup.dto';
import { SignupResponse } from '../models/signup-response.model';
import { VerifyOtpRequestDto } from '../dtos/verify-otp.dto';
import { VerifyOtpResponse } from '../models/otp-verify.model';
import { ResendOtpRequestDto } from '../dtos/resend-otp.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  /* ================= AUTH ================= */

  login(payload: LoginRequestDto): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login/user`, payload)
      .pipe(
        tap(response => {
          this.setUserData(response);
        })
      );
  }


logout(): Observable<LogoutResponse> {
  return this.http.post<LogoutResponse>(
    `${this.baseUrl}/auth/logout/user`,
    {}
  );
}


register(
  data: SignupRequestDto & { role: 'recruiter' | 'jobSeeker' }
): Observable<SignupResponse> {

  const endpoint =
    data.role === 'recruiter'
      ? '/auth/recruiter/signup'
      : '/auth/jobSeeker/signup';

  return this.http.post<SignupResponse>(
    `${this.baseUrl}${endpoint}`,
    {
      registrationDetails: data.registrationDetails
    }
  );
}


  /* ================= OTP ================= */

verifyOtp(
  payload: VerifyOtpRequestDto
): Observable<VerifyOtpResponse> {
  return this.http.post<VerifyOtpResponse>(
    `${this.baseUrl}/auth/verify-verification-code`,
    payload
  );
}


resendOtp(
  payload: ResendOtpRequestDto
): Observable<VerifyOtpResponse> {
  return this.http.post<VerifyOtpResponse>(
    `${this.baseUrl}/auth/send-verification-code`,
    payload
  );
}


  /* ================= TOKEN ================= */

  getToken(): string | null {
    return localStorage.getItem('JWT_Token');
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = jwtDecode(token);
    return Date.now() > decoded.exp * 1000;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /* ================= STORAGE ================= */

  private setUserData(user: LoginResponse): void {
    localStorage.setItem('JWT_Token', user.token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  clearAuthData(): void {
    localStorage.removeItem('JWT_Token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  }

  /* ================= HELPERS ================= */

  getUserData(): LoginResponse | null {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  getRole(): string | null {
    return this.getUserData()?.role ?? null;
  }

  getUserId(): string | null {
    return this.getUserData()?.userId ?? null;
  }

  getFullName(): string | null {
    return this.getUserData()?.fullName ?? null;
  }
}
