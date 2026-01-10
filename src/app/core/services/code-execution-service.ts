import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CodeExecutionService {

  private baseUrl = `${environment.apiGatewayUrl}/code`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  runCode(payload: {
    language: string;
    code: string;
  }): Observable<{ output: string; error: string | null }> {
    return this.http.post<{ output: string; error: string | null }>(
      `${this.baseUrl}/execute`,
      {
        ...payload,
        type: 'run'
      },
      { headers: this.getHeaders() }
    );
  }
}
