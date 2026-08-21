import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private apiUrl = 'http://localhost:5000/api/support';

  constructor(private http: HttpClient) { }

  // --- User Routes (Freelancer/Client) ---
  createTicket(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets`, data);
  }

  getUserTickets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets`);
  }

  getTicketById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/${id}`);
  }

  replyToTicketByUser(id: string, reply: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets/${id}/reply`, reply);
  }

  resolveTicket(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets/${id}/resolve`, {});
  }

  // --- Admin Routes ---
  getAllTicketsAdmin(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/tickets`);
  }

  replyToTicketAdmin(id: string, reply: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/tickets/${id}/reply`, reply);
  }

  updateTicketStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/tickets/${id}/status`, { status });
  }

  closeTicket(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/tickets/${id}/close`, {});
  }
}
