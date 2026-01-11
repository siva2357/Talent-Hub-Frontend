import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CodingResult, CodingTestCase } from '../models/assessment.model';

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
  testCases: CodingTestCase[];
}): Observable<{ results: CodingResult[] }> {
  return this.http.post<{ results: CodingResult[] }>(
    `${this.baseUrl}/execute`,
    payload,
    { headers: this.getHeaders() }
  );
}

}
