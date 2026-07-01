import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SendOfferDto, SignOfferDto, OfferResponse, FreelancerOffersResponse } from '../DTOs/offer.dto';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiGatewayUrl}/offers`;

  createOffer(applicationId: string, payload: SendOfferDto): Observable<OfferResponse> {
    return this.http.post<OfferResponse>(`${this.apiUrl}/${applicationId}`, payload);
  }

  getOfferById(offerId: string): Observable<OfferResponse> {
    return this.http.get<OfferResponse>(`${this.apiUrl}/${offerId}`);
  }

  signOffer(offerId: string, payload: SignOfferDto): Observable<OfferResponse> {
    return this.http.put<OfferResponse>(`${this.apiUrl}/${offerId}/sign`, payload);
  }

  declineOffer(offerId: string): Observable<OfferResponse> {
    return this.http.put<OfferResponse>(`${this.apiUrl}/${offerId}/decline`, {});
  }

  getFreelancerOffers(): Observable<FreelancerOffersResponse> {
    return this.http.get<FreelancerOffersResponse>(`${this.apiUrl}/freelancer/me`);
  }

  getContractPdfUrl(offerId: string): string {
    const token = this.authService.token();
    return `${this.apiUrl}/${offerId}/pdf?token=${token}`;
  }
}
