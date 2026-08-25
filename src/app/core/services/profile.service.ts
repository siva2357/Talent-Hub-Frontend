import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = 'http://localhost:5000/api/profile';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  completeProfile(profileData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/complete`, profileData).pipe(
      tap(response => {
        if (response.success) {
          this.tokenService.setProfileCompleted(true);
        }
      })
    );
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/me`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/update`, profileData);
  }

  getAllFreelancers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/freelancers`);
  }

  getProfileById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/user/${id}`);
  }

  deleteProfile(): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/delete`);
  }
}
