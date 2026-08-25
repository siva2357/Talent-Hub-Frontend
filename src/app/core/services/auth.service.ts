import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../dtos/auth.dto';
import { AuthResponse } from '../models/user.model';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update this to match your backend port
  private readonly API_URL = 'http://localhost:5000/api/auth';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data);
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.tokenService.setToken(response.token);
          if (response.role) {
            this.tokenService.setRole(response.role);
          }
          if (response.profileCompleted !== undefined) {
            this.tokenService.setProfileCompleted(response.profileCompleted);
          }
        }
      })
    );
  }

  verifyOtp(data: VerifyOtpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/verify-otp`, data);
  }

  verifyResetOtp(data: VerifyOtpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/verify-reset-otp`, data);
  }

  resendOtp(data: { email: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/resend-otp`, data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/reset-password`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/change-password`, data);
  }

  logout(): void {
    this.tokenService.clearAll();
    this.router.navigate(['/login']);
  }
}
