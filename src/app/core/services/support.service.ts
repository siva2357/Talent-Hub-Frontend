import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

import {
  CreateSupportTicketDto,
  SupportTicketReplyDto,
  UpdateTicketStatusDto
} from '../DTOs/support-ticket.dto';

import {
  SupportRequest,
  SupportTicketResponse,
  SupportTicketListResponse,
  GenericSupportResponse
} from '../model/support-request.model';

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

  createTicket(
    data: CreateSupportTicketDto
  ): Observable<{
    success: boolean;
    message: string;
    ticket: SupportRequest;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      ticket: SupportRequest;
    }>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.CREATE_TICKET}`,
      data,
      this.getHeaders()
    );
  }

  getMyTickets(): Observable<SupportTicketListResponse> {
    return this.http.get<SupportTicketListResponse>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.GET_MY_TICKETS}`,
      this.getHeaders()
    );
  }

  getTicketById(
    ticketId: string
  ): Observable<SupportTicketResponse> {
    return this.http.get<SupportTicketResponse>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.GET_TICKET_BY_ID(ticketId)}`,
      this.getHeaders()
    );
  }

  replyToTicket(
    ticketId: string,
    reply: SupportTicketReplyDto
  ): Observable<GenericSupportResponse> {
    return this.http.post<GenericSupportResponse>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.USER_REPLY(ticketId)}`,
      reply,
      this.getHeaders()
    );
  }

  resolveTicket(
    ticketId: string
  ): Observable<GenericSupportResponse> {
    return this.http.post<GenericSupportResponse>(
      `${this.baseUrl}${API_ENDPOINTS.SUPPORT.RESOLVE_TICKET(ticketId)}`,
      {},
      this.getHeaders()
    );
  }



getAllTickets(): Observable<SupportRequest[]> {
  return this.http.get<SupportRequest[]>(
    `${this.baseUrl}${API_ENDPOINTS.SUPPORT.GET_ALL_TICKETS}`,
    this.getHeaders()
  );
}

adminReplyToTicket(
  ticketId: string,
  reply: SupportTicketReplyDto
): Observable<GenericSupportResponse> {
  return this.http.post<GenericSupportResponse>(
    `${this.baseUrl}${API_ENDPOINTS.SUPPORT.ADMIN_REPLY(ticketId)}`,
    reply,
    this.getHeaders()
  );
}



updateTicketStatus(
  ticketId: string,
  data: UpdateTicketStatusDto
): Observable<GenericSupportResponse> {
  return this.http.patch<GenericSupportResponse>(
    `${this.baseUrl}${API_ENDPOINTS.SUPPORT.UPDATE_STATUS(ticketId)}`,
    data,
    this.getHeaders()
  );
}



closeTicket(
  ticketId: string
): Observable<GenericSupportResponse> {
  return this.http.post<GenericSupportResponse>(
    `${this.baseUrl}${API_ENDPOINTS.SUPPORT.CLOSE_TICKET(ticketId)}`,
    {},
    this.getHeaders()
  );
}



}