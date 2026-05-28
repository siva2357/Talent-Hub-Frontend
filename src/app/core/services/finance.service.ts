import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    return this.http.get(`${this.baseUrl}/finance/stats`, this.getHeaders());
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/finance/transactions`, this.getHeaders());
  }

  getInvoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/finance/invoices`, this.getHeaders());
  }

  createRazorpayOrder(amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/finance/razorpay/order`, { amount }, this.getHeaders());
  }

  verifyRazorpayPayment(payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    amount: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/finance/razorpay/verify`, payload, this.getHeaders());
  }

  withdraw(amount: number, contractId?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/finance/withdraw`, { amount, contractId }, this.getHeaders());
  }
}
