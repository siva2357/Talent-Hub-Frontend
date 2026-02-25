import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateCompanyDTO, UpdateCompanyDTO } from '../dtos/company.dto';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
    private baseUrl = environment.apiGatewayUrl;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('JWT_Token');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }


    createCompany(
  payload: CreateCompanyDTO
): Observable<{ success: boolean; message: string; data: Company }> {
  return this.http
    .post<{ success: boolean; message: string; data: Company }>(
      `${this.baseUrl}/company`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(this.handleError));
}


updateCompany(
  companyId: string,
  payload: UpdateCompanyDTO
): Observable<{ success: boolean; message: string; data: Company }> {
  return this.http
    .put<{ success: boolean; message: string; data: Company }>(
      `${this.baseUrl}/company/${companyId}`,
      payload,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(this.handleError));
}



getCompaniesList(): Observable<{
  success: boolean;
  count: number;
  data: string[];
}> {
  return this.http.get<{
    success: boolean;
    count: number;
    data: string[];
  }>(`${this.baseUrl}/company/list`)
  .pipe(catchError(this.handleError));
}

getAllCompanies(): Observable<{
  success: boolean;
  count: number;
  data: Company[];
}> {
  return this.http
    .get<{
      success: boolean;
      count: number;
      data: Company[];
    }>(`${this.baseUrl}/company`, {
      headers: this.getHeaders(),
    })
    .pipe(catchError(this.handleError));
}




getCompanyById(
  companyId: string
): Observable<{ success: boolean; data: Company }> {
  return this.http
    .get<{ success: boolean; data: Company }>(
      `${this.baseUrl}/company/${companyId}`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(this.handleError));
}


deleteCompany(
  companyId: string
): Observable<{ success: boolean; message: string }> {
  return this.http
    .delete<{ success: boolean; message: string }>(
      `${this.baseUrl}/company/${companyId}`,
      { headers: this.getHeaders() }
    )
    .pipe(catchError(this.handleError));
}



  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

}
