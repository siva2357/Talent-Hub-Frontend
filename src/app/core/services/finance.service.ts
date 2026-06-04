import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiGatewayUrl;

  private getHeaders() {
    const token = localStorage.getItem('th_token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.FINANCE.STATS}`, this.getHeaders());
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.FINANCE.TRANSACTIONS}`, this.getHeaders());
  }

  getInvoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}${API_ENDPOINTS.FINANCE.INVOICES}`, this.getHeaders());
  }

  createRazorpayOrder(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.FINANCE.RAZORPAY_ORDER}`, { amount }, this.getHeaders());
  }

  verifyRazorpayPayment(payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    amount: number;
    contractId?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.FINANCE.RAZORPAY_VERIFY}`, payload, this.getHeaders());
  }

  withdraw(amount: number, contractId?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${API_ENDPOINTS.FINANCE.WITHDRAW}`, { amount, contractId }, this.getHeaders());
  }

  getInvoicePdfUrl(transactionId: string): string {
    const token = localStorage.getItem('th_token') || '';
    return `${this.baseUrl}/finance/invoices/${transactionId}/download?token=${token}`;
  }
}
