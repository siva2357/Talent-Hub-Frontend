import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { Portfolio } from '../model/portfolio.model';
import { CreatePortfolioDto, UpdatePortfolioDto } from '../DTOs/portfolio.dto';



@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private http = inject(HttpClient);

  private readonly apiUrl =
    environment.apiGatewayUrl;

  createPortfolio(
    payload: CreatePortfolioDto
  ): Observable<Portfolio> {

    return this.http
      .post<any>(
        `${this.apiUrl}${API_ENDPOINTS.PORTFOLIO.CREATE}`,
        payload
      )
      .pipe(
        map(res => res.portfolio)
      );
  }

  getMyPortfolio(): Observable<Portfolio[]> {

    return this.http
      .get<any>(
        `${this.apiUrl}${API_ENDPOINTS.PORTFOLIO.MY}`
      )
      .pipe(
        map(res => res.portfolios || [])
      );
  }

  getPortfolioByFreelancerId(
    freelancerId: string
  ): Observable<Portfolio[]> {

    return this.http
      .get<any>(
        `${this.apiUrl}${API_ENDPOINTS.PORTFOLIO.FREELANCER(
          freelancerId
        )}`
      )
      .pipe(
        map(res => res.portfolios || [])
      );
  }

  updatePortfolio(
    portfolioId: string,
    payload: UpdatePortfolioDto
  ): Observable<Portfolio> {

    return this.http
      .put<any>(
        `${this.apiUrl}${API_ENDPOINTS.PORTFOLIO.UPDATE(
          portfolioId
        )}`,
        payload
      )
      .pipe(
        map(res => res.portfolio)
      );
  }

  deletePortfolio(
    portfolioId: string
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${API_ENDPOINTS.PORTFOLIO.DELETE(
        portfolioId
      )}`
    );
  }
}