import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RecruiterProfileService {
  private baseUrl: string = environment.apiGatewayUrl;
  constructor(private http: HttpClient, private router: Router) { }
  createProfile(payload: any) {
    return this.http.post(`${this.baseUrl}/recruiter/createProfile`, payload);
  }
}
