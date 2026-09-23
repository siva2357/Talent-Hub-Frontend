import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OfferService extends BaseService {
  private apiUrl = `${environment.apiGatewayUrl}/offers`;

  

  createOffer(applicationId: string, offerData: any): Observable<any> {
    return this.post(`${this.apiUrl}/${applicationId}`, offerData);
  }

  getFreelancerOffers(): Observable<any> {
    return this.get(`${this.apiUrl}/freelancer/me`);
  }

  getOfferById(offerId: string): Observable<any> {
    return this.get(`${this.apiUrl}/${offerId}`);
  }

  getOfferPreview(offerId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${offerId}/preview`, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }

  signOffer(offerId: string, signatureData: any): Observable<any> {
    return this.put(`${this.apiUrl}/${offerId}/sign`, signatureData);
  }

  declineOffer(offerId: string): Observable<any> {
    return this.put(`${this.apiUrl}/${offerId}/decline`, {});
  }
}
