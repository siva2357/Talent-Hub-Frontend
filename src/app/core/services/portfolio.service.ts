import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/portfolio';

  

  createPortfolio(data: any): Observable<any> {
    return this.post<any>(this.apiUrl, data);
  }

  getMyPortfolios(): Observable<any> {
    return this.get<any>(`${this.apiUrl}/my`);
  }

  deletePortfolio(id: string): Observable<any> {
    return this.delete<any>(`${this.apiUrl}/${id}`);
  }

  getPortfolioById(id: string): Observable<any> {
    return this.get<any>(`${this.apiUrl}/${id}`);
  }

  updatePortfolio(id: string, data: any): Observable<any> {
    return this.put<any>(`${this.apiUrl}/${id}`, data);
  }
}
