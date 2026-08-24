import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `${environment.apiGatewayUrl}/offers`;

  constructor(private http: HttpClient) { }

  createOffer(applicationId: string, offerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${applicationId}`, offerData);
  }

  getFreelancerOffers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/freelancer/me`);
  }

  getOfferById(offerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${offerId}`);
  }

  getOfferPreview(offerId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${offerId}/preview`, { responseType: 'text' });
  }

  signOffer(offerId: string, signatureData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${offerId}/sign`, signatureData);
  }

  declineOffer(offerId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${offerId}/decline`, {});
  }
}
