import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService {
  private apiUrl = 'http://localhost:5000/api/finance'; // Base URL for finance routes

  // --- Reports & Stats ---
  getFinanceStats(): Observable<any> {
    return this.get(`${this.apiUrl}/stats`);
  }

  getTransactions(): Observable<any> {
    return this.get(`${this.apiUrl}/transactions`);
  }

  getContractTransactions(): Observable<any> {
    return this.get(`${this.apiUrl}/contract-transactions`);
  }

  getFreelancerFinanceReport(): Observable<any> {
    return this.get(`${this.apiUrl}/freelancer-report`);
  }

  // --- Invoices & PDFs ---
  getInvoices(): Observable<any> {
    return this.get(`${this.apiUrl}/invoices`);
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
    return this.post(`${this.apiUrl}/razorpay/order`, payload);
  }

  verifyRazorpayPayment(payload: any): Observable<any> {
    return this.post(`${this.apiUrl}/razorpay/verify`, payload);
  }

  // --- Withdrawals ---
  withdrawFunds(payload: any): Observable<any> {
    return this.post(`${this.apiUrl}/withdraw`, payload);
  }
}
