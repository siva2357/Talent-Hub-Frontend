import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { Login, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode' ;
import { environment } from '../../../environments/environment';
import { RegistrationPayload, RegistrationResponse } from '../dtos/auth.dto';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.apiGatewayUrl;
  private userRole: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('JWT_Token')}`,
      'Content-Type': 'application/json'
    });
  }


register(data: RegistrationPayload): Observable<RegistrationResponse> {
  const endpoint = data.role === 'recruiter' ? '/auth/recruiter/signup':'/auth/jobSeeker/signup';
  return this.http.post<RegistrationResponse>(`${this.baseUrl}${endpoint}`,data)
  .pipe(catchError(err => this.handleError(err)));
}





login(loginData: Login): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login/user`, loginData)
    .pipe(
      tap(response => {
        if (response && response.role && response.token !== undefined) {
          if (this.isTokenExpired(response.token)) {
            window.alert('Session expired, please log in again.');
            this.logout();
          } else {
            this.setUserData(response);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('JWT_Token', response.token);
            console.log("Received token:", response.token);

          }
        } else {
          throw new Error('Invalid login response');
        }
      }),
      catchError(error => {
        console.error('Login Error:', error);
        window.alert('Invalid credentials');
        return throwError(() => new Error(error));
      })
    );
}

isTokenExpired(token: string): boolean {
  const decoded: any = this.decodeJwt(token);
  const expTime = decoded?.exp * 1000;
  return Date.now() > expTime;
}

decodeJwt(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

// auth-service.ts
logout(): Observable<any> {
  const token = localStorage.getItem('JWT_Token');

  const headers = new HttpHeaders({
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  });

  return this.http.post(
    `${this.baseUrl}/auth/logout/user`,
    {},
    { headers, withCredentials: true }
  );
}


private setUserData(user: LoginResponse) {
  if (user && user.token) {
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('JWT_Token', user.token);
    localStorage.setItem('Authorization', user.token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.userId);
  } else {
    console.log('Invalid user data:', user);
  }
}

private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  window.alert('An unexpected error occurred. Please try again.');
  return throwError(() => new Error('Something went wrong; please try again later.'));
}




verifyOtp(
  providedCode: string,
  email: string,
  role: string
): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/auth/verify-verification-code`,
    { email, providedCode, role }
  );
}



 resendOtp(email: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/send-verification-code`, { email })
    .pipe(catchError(error => this.handleError(error)));
}


  getToken(): string | null {
    const token = localStorage.getItem('JWT_Token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
    }
    return token;
  }





  setUserRole(role: string) {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  getUserData(): any {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    return user || null;
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('userData');
  }

  getUserName(): string | null {
    const user = this.getUserData();
    return user?.userName || null;
  }

    getFullName(): string | null {
    const user = this.getUserData();
    return user?.fullName || null;

  }

  getRole(): string | null {
    const user = this.getUserData();
    return user?.role || null;
  }

  getUserId(): string | null {
    const user = this.getUserData();
    return user?._id || null;
  }








}

