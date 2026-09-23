import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected http = inject(HttpClient);
  protected tokenService = inject(TokenService);

  protected getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  protected get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, { headers: this.getAuthHeaders(), params });
  }

  protected post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body, { headers: this.getAuthHeaders() });
  }

  protected put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body, { headers: this.getAuthHeaders() });
  }

  protected patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(url, body, { headers: this.getAuthHeaders() });
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, { headers: this.getAuthHeaders() });
  }
}
