import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  createTicket(data: { ticketId?: string, category: string, subcategory: string, description: string, attachments?: { name: string, url: string }[] }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.CREATE_TICKET}`,
      data,
      this.getHeaders()
    );
  }

  getMyTickets(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.GET_MY_TICKETS}`,
      this.getHeaders()
    );
  }

  submitUserFeedbackAndResolve(ticketId: string, feedbackText: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.FEEDBACK(ticketId)}`,
      { feedbackText },
      this.getHeaders()
    );
  }
}
