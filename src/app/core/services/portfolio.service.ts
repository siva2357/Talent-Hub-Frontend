import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:5000/api/portfolio';

  constructor(private http: HttpClient) { }

  createPortfolio(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getMyPortfolios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my`);
  }

  deletePortfolio(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
