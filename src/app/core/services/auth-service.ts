import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  googleSignup(idToken: string, role: string) {
    return this.http.post(`${this.api}/auth/google/signup`, { idToken, role });
  }

  googleLogin(idToken: string) {
    return this.http.post(`${this.api}/auth/google/login`, { idToken });
  }

  // ------------------------------------------------
  // ⭐ Save token + user into localStorage
  // ------------------------------------------------
  saveAuthData(token: string, user: any) {
    // clean old data
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    // save new data
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  // ------------------------------------------------
  // Get token
  // ------------------------------------------------
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // ------------------------------------------------
  // Get user object
  // ------------------------------------------------
  getUser() {
    const data = localStorage.getItem('authUser');
    return data ? JSON.parse(data) : null;
  }

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
}
