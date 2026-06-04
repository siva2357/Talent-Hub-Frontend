import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
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
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.COMPLETE}`, data).pipe(
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
    return this.http.get<{ success: boolean; user: any; profile: FreelancerProfile | ClientProfile | null; contracts: Contract[]; diaries?: any[]; }>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.ME}`);
  }

  /**
   * Updates existing profile details and optional profile photo.
   * Typically accepts FormData because profile picture upload uses multipart/form-data.
   */
  updateProfile(data: FormData | { basicInformation: any; professionalDetails: any; location: any; availability?: any; socialLinks?: any; languages?: any }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.UPDATE}`, data);
  }

  /**
   * Deletes the user's profile and resets user profileCompleted status.
   */
  deleteProfile(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.DELETE}`).pipe(
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
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.SEND_PHONE_OTP}`, { phoneNumber });
  }

  /**
   * Verifies the SMS OTP code sent to the user's mobile number.
   */
  verifyPhoneOTP(phoneNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.VERIFY_PHONE_OTP}`, { phoneNumber, otp }).pipe(
      tap((res) => {
        if (res.success) {
          // Refresh auth user signal to sync mobileVerification status
          this.authService.fetchCurrentUser().subscribe();
        }
      })
    );
  }

  /**
   * Fetches all freelancer profiles from the database matching the given filter criteria.
   */
  getFreelancers(params?: { search?: string; category?: string; minRate?: number; maxRate?: number }): Observable<{ success: boolean; freelancers: any[] }> {
    return this.http.get<{ success: boolean; freelancers: any[] }>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.FREELANCERS}`, { params: params as any });
  }

  /**
   * Fetches a specific freelancer profile by ID.
   */
  getFreelancerProfileById(id: string): Observable<{ success: boolean; profile: any }> {
    return this.http.get<{ success: boolean; profile: any }>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.FREELANCER(id)}`);
  }

  /**
   * Saves a freelancer profile to the logged-in client's bookmarks.
   */
  saveTalent(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.SAVE_TALENT(id)}`, {});
  }

  /**
   * Removes a freelancer profile from the logged-in client's bookmarks.
   */
  unsaveTalent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.UNSAVE_TALENT(id)}`);
  }

  /**
   * Fetches all saved talents for the logged-in client.
   */
  getSavedTalents(): Observable<{ success: boolean; savedTalents: any[] }> {
    return this.http.get<{ success: boolean; savedTalents: any[] }>(`${this.baseUrl}${API_ENDPOINTS.PROFILE.SAVED_TALENTS}`);
  }
}
