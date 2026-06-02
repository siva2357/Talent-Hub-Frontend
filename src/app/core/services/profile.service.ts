import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { FreelancerProfile, ClientProfile } from '../model/user.model';
import { Contract } from '../model/contract.model';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = environment.apiGatewayUrl;

  /**
   * Submits profile details and optional profile photo to complete the profile.
   * Typically accepts FormData because profile picture upload uses multipart/form-data.
   */
  completeProfile(data: FormData | { basicInformation: any; professionalDetails: any; location: any; availability?: any; socialLinks?: any; languages?: any }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profile/complete`, data).pipe(
      tap((res) => {
        if (res.success) {
          // Refresh auth user signal to sync the 'profileCompleted' status
          this.authService.fetchCurrentUser().subscribe();
        }
      })
    );
  }

  /**
   * Retrieves the current user's profile and user status.
   */
  getMyProfile(): Observable<{ success: boolean; user: any; profile: FreelancerProfile | ClientProfile | null; contracts: Contract[]; diaries?: any[]; }> {
    return this.http.get<{ success: boolean; user: any; profile: FreelancerProfile | ClientProfile | null; contracts: Contract[]; diaries?: any[]; }>(`${this.baseUrl}/profile/me`);
  }

  /**
   * Updates existing profile details and optional profile photo.
   * Typically accepts FormData because profile picture upload uses multipart/form-data.
   */
  updateProfile(data: FormData | { basicInformation: any; professionalDetails: any; location: any; availability?: any; socialLinks?: any; languages?: any }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/profile/update`, data);
  }

  /**
   * Deletes the user's profile and resets user profileCompleted status.
   */
  deleteProfile(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/profile/delete`).pipe(
      tap((res) => {
        if (res.success) {
          // Refresh auth user signal to sync the 'profileCompleted' status
          this.authService.fetchCurrentUser().subscribe();
        }
      })
    );
  }

  /**
   * Requests an SMS OTP code to be sent to a user's mobile number.
   */
  sendPhoneOTP(phoneNumber: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profile/phone/send-otp`, { phoneNumber });
  }

  /**
   * Verifies the SMS OTP code sent to the user's mobile number.
   */
  verifyPhoneOTP(phoneNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profile/phone/verify-otp`, { phoneNumber, otp }).pipe(
      tap((res) => {
        if (res.success) {
          // Refresh auth user signal to sync mobileVerification status
          this.authService.fetchCurrentUser().subscribe();
        }
      })
    );
  }
}
