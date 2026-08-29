import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService {
  private readonly API_URL = 'http://localhost:5000/api/profile';

  

  completeProfile(profileData: any): Observable<any> {
    return this.post<any>(`${this.API_URL}/complete`, profileData).pipe(
      tap(response => {
        if (response.success) {
          this.tokenService.setProfileCompleted(true);
        }
      })
    );
  }

  getMyProfile(): Observable<any> {
    return this.get<any>(`${this.API_URL}/me`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.put<any>(`${this.API_URL}/update`, profileData);
  }

  getAllFreelancers(): Observable<any> {
    return this.get<any>(`${this.API_URL}/freelancers`);
  }

  getProfileById(id: string): Observable<any> {
    return this.get<any>(`${this.API_URL}/user/${id}`);
  }

  deleteProfile(): Observable<any> {
    return this.delete<any>(`${this.API_URL}/delete`);
  }
}
