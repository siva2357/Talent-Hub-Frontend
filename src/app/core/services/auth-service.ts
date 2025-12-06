import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiGatewayUrl; // http://localhost:5000

  constructor(private http: HttpClient) {}

  // ------------------------------------------------
  // ⭐ GOOGLE SIGNUP (needs idToken + role)
  // ------------------------------------------------
  googleSignup(idToken: string, role: string) {
    return this.http.post(`${this.api}/auth/google/signup`, {
      idToken,
      role
    });
  }

  // ------------------------------------------------
  // ⭐ GOOGLE LOGIN (only idToken)
  // ------------------------------------------------
  googleLogin(idToken: string) {
    return this.http.post(`${this.api}/auth/google/login`, {
      idToken
    });
  }

  // ------------------------------------------------
  // Save JWT token
  // ------------------------------------------------
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // ------------------------------------------------
  // Get JWT token
  // ------------------------------------------------
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------
  logout() {
    localStorage.removeItem('authToken');
  }
}
