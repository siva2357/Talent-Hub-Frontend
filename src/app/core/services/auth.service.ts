import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import {
  RegisterRequest,
  VerifyOtpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginResponse
} from '../DTOs/auth.dto';
import { Registration } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  // Signals for state management
  private _currentUser = signal<Registration | null>(null);
  private _token = signal<string | null>(null);

  // Readonly exposures
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly token = this._token.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initializes authentication state from local storage.
   */
  private initializeAuth(): void {
    const token = localStorage.getItem('th_token');
    const userJson = localStorage.getItem('th_user');

    if (token) {
      this._token.set(token);
    }
    if (userJson) {
      try {
        this._currentUser.set(JSON.parse(userJson));
      } catch (e) {
        this.logout();
      }
    }
  }

  /**
   * Registers a new user.
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, data);
  }

  /**
   * Verifies the registration OTP.
   */
  verifyOTP(data: VerifyOtpRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.VERIFY_OTP}`, data);
  }

  /**
   * Authenticates the user and fetches their profile info.
   */
  login(data: LoginRequest): Observable<Registration> {
    return this.http.post<LoginResponse>(`${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, data).pipe(
      tap((res) => {
        if (res.token) {
          this._token.set(res.token);
          localStorage.setItem('th_token', res.token);
        }
      }),
      switchMap(() => this.fetchCurrentUser())
    );
  }

  /**
   * Fetches the logged in user's profile metadata and updates state.
   */
  fetchCurrentUser(): Observable<Registration> {
    return this.http.get<{ success: boolean; user: Registration }>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.ME}`).pipe(
      tap((res) => {
        if (res.success && res.user) {
          this._currentUser.set(res.user);
          localStorage.setItem('th_user', JSON.stringify(res.user));
        }
      }),
      switchMap((res) => new Observable<Registration>((observer) => {
        observer.next(res.user);
        observer.complete();
      }))
    );
  }

  /**
   * Logs out the user and clears all session information.
   */
  logout(): void {
    this._token.set(null);
    this._currentUser.set(null);
    localStorage.removeItem('th_token');
    localStorage.removeItem('th_user');
  }

  /**
   * Requests password reset OTP.
   */
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, data);
  }

  /**
   * Verifies the reset password OTP.
   */
  verifyResetOTP(data: VerifyResetOtpRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.VERIFY_RESET_OTP}`, data);
  }

  /**
   * Resets the user password.
   */
  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, data);
  }

  /**
   * Sends a forgot password code via email (from forgotPasswordRouter).
   */
  sendForgotPasswordCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD_CODE}`, { email });
  }

  /**
   * Verifies the forgot password code (from forgotPasswordRouter).
   */
  verifyForgotPasswordCode(email: string, providedCode: string | number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_CODE}`, { email, providedCode });
  }

  /**
   * Resets the password using the verified code session (from forgotPasswordRouter).
   */
  resetPasswordWithCode(email: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD_WITH_CODE}`, { email, newPassword });
  }

  /**
   * Changes password for authenticated user.
   */
  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`, data);
  }

  /**
   * Programmatically update the cached user signal when metadata updates.
   */
  updateCurrentUser(user: Registration): void {
    this._currentUser.set(user);
    localStorage.setItem('th_user', JSON.stringify(user));
  }
}
