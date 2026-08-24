import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly PROFILE_COMPLETED_KEY = 'profile_completed';

  constructor() { }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  setRole(role: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.ROLE_KEY, role);
    }
  }

  getRole(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.ROLE_KEY);
    }
    return null;
  }

  removeRole(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.ROLE_KEY);
    }
  }

  setProfileCompleted(status: boolean): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.PROFILE_COMPLETED_KEY, JSON.stringify(status));
    }
  }

  getProfileCompleted(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = localStorage.getItem(this.PROFILE_COMPLETED_KEY);
      return val ? JSON.parse(val) : false;
    }
    return false;
  }

  removeProfileCompleted(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.PROFILE_COMPLETED_KEY);
    }
  }

  clearAll(): void {
    this.removeToken();
    this.removeRole();
    this.removeProfileCompleted();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
