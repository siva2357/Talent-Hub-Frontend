import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5000/api/finance'; // Base URL for finance routes

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Reports & Stats ---
  getFinanceStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { headers: this.getAuthHeaders() });
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions`, { headers: this.getAuthHeaders() });
  }

  getContractTransactions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contract-transactions`, { headers: this.getAuthHeaders() });
  }

  getFreelancerFinanceReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/freelancer-report`, { headers: this.getAuthHeaders() });
  }

  // --- Invoices & PDFs ---
  getInvoices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/invoices`, { headers: this.getAuthHeaders() });
  }

  downloadInvoicePdf(invoiceId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/invoices/${invoiceId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  downloadPaymentStatementPdf(contractId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/payments/${contractId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  // --- Razorpay & Payments ---
  createRazorpayOrder(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/razorpay/order`, payload, { headers: this.getAuthHeaders() });
  }

  verifyRazorpayPayment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/razorpay/verify`, payload, { headers: this.getAuthHeaders() });
  }

  // --- Withdrawals ---
  withdrawFunds(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/withdraw`, payload, { headers: this.getAuthHeaders() });
  }
}
