import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company } from '../models/company.modal';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  private baseUrl: string = environment.apiGatewayUrl;

  constructor(private http: HttpClient) {}

  /* =========================
     HEADERS
  ========================= */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error('🚨 JWT token missing');
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /* =========================
     CREATE COMPANY
  ========================= */
  createCompany(data: { companyDetails: any }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/admin/company`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =========================
     GET ALL COMPANIES (ADMIN)
  ========================= */
  getCompanies(): Observable<{ totalCompanies: number; companies: Company[] }> {
    return this.http
      .get<{ totalCompanies: number; companies: Company[] }>(
        `${this.baseUrl}/admin/companies`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  /* =========================
     GET COMPANY BY ID
  ========================= */
  getCompanyById(id: string): Observable<Company> {
    return this.http
      .get<Company>(`${this.baseUrl}/admin/company/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =========================
     UPDATE COMPANY
  ========================= */
  updateCompany(id: string, data: Partial<Company>): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/admin/company/${id}`, data, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =========================
     DELETE COMPANY
  ========================= */
  deleteCompany(id: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/admin/company/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /* =========================
     PUBLIC: COMPANY NAMES
  ========================= */
  getCompanyList(): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.baseUrl}/company-list`)
      .pipe(catchError(this.handleError));
  }



    getCompanyDetails(id: string): Observable<Company> {
    return this.http
      .get<Company>(`${this.baseUrl}/jobSeeker/company/${id}/details`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }


  /* =========================
     ERROR HANDLER
  ========================= */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Server unreachable. Check your connection.';
    }

    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }
}
