import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { LoginResponse, LogoutResponse } from '../models/auth.model';
import { SignupRequestDto } from '../dtos/signup.dto';
import { SignupResponse } from '../models/signup-response.model';
import { VerifyOtpRequestDto } from '../dtos/verify-otp.dto';
import { VerifyOtpResponse } from '../models/otp-verify.model';
import { ResendOtpRequestDto } from '../dtos/resend-otp.dto';
import { LoginRequestDto } from '../dtos/auth.dto';

import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiGatewayUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  /* ================= AUTH ================= */

  login(payload: LoginRequestDto): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap(response => {
          this.setUserData(response);
        })
      );
  }


logout(): Observable<LogoutResponse> {
  return this.http.post<LogoutResponse>(
    `${this.baseUrl}/auth/logout`,
    {}
  );
}


register(data: SignupRequestDto): Observable<SignupResponse> {
  return this.http.post<SignupResponse>(
    `${this.baseUrl}/auth/signup`,
    data
  );
}


  /* ================= OTP ================= */

  changePassword(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/auth/change-password`, payload, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }


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
  try {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('JWT_Token');
    }
    return null;
  } catch {
    return null;
  }
}

isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);

    // if no exp → don't force logout
    if (!decoded.exp) return false;

    return Date.now() > decoded.exp * 1000;
  } catch {
    return true; // invalid token → treat as expired
  }
}

isLoggedIn(): boolean {
  const token = this.getToken();
  return !!token && !this.isTokenExpired(token);
}

  /* ================= STORAGE ================= */

private setUserData(user: LoginResponse): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('JWT_Token', user.token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}

clearAuthData(): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('JWT_Token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  }
}

  /* ================= HELPERS ================= */

getUserData(): LoginResponse | null {
  if (isPlatformBrowser(this.platformId)) {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

getRole(): string | null {
  const user = this.getUserData();
  if (user?.role) return user.role;

  const token = this.getToken();
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  }

  return null;
}

  getUserId(): string | null {
    return this.getUserData()?.userId ?? null;
  }

  getFullName(): string | null {
    return this.getUserData()?.fullName ?? null;
  }

  getProfileImage(): string | null {
  return this.getUserData()?.profileImage ?? null;
}
}
