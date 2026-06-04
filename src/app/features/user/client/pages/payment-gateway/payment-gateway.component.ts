import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../../../../../core/services/finance.service';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private financeService = inject(FinanceService);

  // Flow State: 'initial' | 'processing' | 'success' | 'failed'
  paymentState: 'initial' | 'processing' | 'success' | 'failed' = 'initial';

  // Payment configuration
  depositAmount = 1000;
  depositMethod = 'card';
  errorMessage = '';
  contractId = '';
  contractTitle = '';

  // Order Details
  orderId = '';
  paymentId = '';
  signature = '';
  isSandbox = false;

  // Invoice Meta
  invoiceNumber = '';
  paymentDate = '';

  ngOnInit() {
    this.loadRazorpayScript();
    
    // Read optional amount query parameter
    this.route.queryParams.subscribe(params => {
      const amountParam = parseFloat(params['amount']);
      if (amountParam && amountParam > 0) {
        this.depositAmount = amountParam;
      }
      if (params['contractId']) {
        this.contractId = params['contractId'];
      }
      if (params['contractTitle']) {
        this.contractTitle = params['contractTitle'];
      }
    });
  }

  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  initiatePayment() {
    if (this.depositAmount <= 0) {
      this.errorMessage = 'Please enter a valid deposit amount greater than zero.';
      return;
    }
    
    this.paymentState = 'processing';
    this.errorMessage = '';

    // Calculate total amount to charge: includes 10% platform fee if contractId is set
    const totalAmount = this.contractId ? this.depositAmount * 1.10 : this.depositAmount;

    // Step 1: Create Order on Backend
    this.financeService.createRazorpayOrder(totalAmount).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.orderId = res.order.id;
          this.isSandbox = res.isSandbox;
          
          const userDetailsJson = localStorage.getItem('th_user');
          let userName = 'Client';
          let userEmail = 'client@talenthub.com';
          let userContact = '9999999999';
          if (userDetailsJson) {
            try {
              const userObj = JSON.parse(userDetailsJson);
              userName = userObj.fullName || userObj.registrationDetails?.fullName || 'Client';
              userEmail = userObj.email || userObj.registrationDetails?.email || 'client@talenthub.com';
              userContact = userObj.phoneNumber || userObj.phone || userObj.registrationDetails?.phoneNumber || userObj.registrationDetails?.phone || '9999999999';
            } catch (e) {}
          }

          // Step 2: Handle sandbox fallback vs real Razorpay widget
          if (res.isSandbox || !(window as any).Razorpay) {
            // Simulated sandbox delay
            setTimeout(() => {
              const mockPaymentId = `txn_mock_${Math.random().toString(36).substring(2, 11)}`;
              this.verifyPayment({
                razorpay_payment_id: mockPaymentId,
                razorpay_order_id: this.orderId,
                razorpay_signature: 'sandbox_signature',
                amount: totalAmount,
                contractId: this.contractId || undefined
              });
            }, 1500);
            return;
          }

          // Real Razorpay widget initialization
          const options = {
            key: res.keyId,
            amount: res.order.amount,
            currency: res.order.currency,
            name: 'Talent Hub',
            description: this.contractId ? `Fund Contract: ${this.contractTitle}` : 'Deposit Funds to Wallet',
            order_id: this.orderId,
            handler: (response: any) => {
              this.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: totalAmount,
                contractId: this.contractId || undefined
              });
            },
            prefill: {
              name: userName,
              email: userEmail,
              contact: userContact
            },
            theme: {
              color: '#0d6efd'
            },
            modal: {
              ondismiss: () => {
                this.paymentState = 'initial';
                this.errorMessage = 'Payment was cancelled by the user.';
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          this.paymentState = 'failed';
          this.errorMessage = 'Failed to generate payment order.';
        }
      },
      error: (err) => {
        this.paymentState = 'failed';
        this.errorMessage = err.error?.message || 'Failed to communicate with payment service.';
      }
    });
  }

  verifyPayment(payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    amount: number;
    contractId?: string;
  }) {
    this.financeService.verifyRazorpayPayment(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.paymentId = payload.razorpay_payment_id;
          this.signature = payload.razorpay_signature;
          this.paymentDate = new Date().toLocaleString();
          this.invoiceNumber = `DEP-INV-${Math.floor(100000 + Math.random() * 900000)}`;
          this.paymentState = 'success';
          
          // Auto-redirect to financial summary page after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/user/financial-summary']);
          }, 1500);
        } else {
          this.paymentState = 'failed';
          this.errorMessage = 'Transaction verification rejected by server.';
        }
      },
      error: (err) => {
        this.paymentState = 'failed';
        this.errorMessage = err.error?.message || 'Server error verifying payment.';
      }
    });
  }

  downloadInvoice() {
    const userDetailsJson = localStorage.getItem('th_user');
    let userName = 'Client Account';
    let userEmail = '';
    if (userDetailsJson) {
      try {
        const userObj = JSON.parse(userDetailsJson);
        userName = userObj.fullName || userObj.registrationDetails?.fullName || 'Client Account';
        userEmail = userObj.email || userObj.registrationDetails?.email || '';
      } catch (e) {}
    }

    const description = this.contractId
      ? `Contract Funding - ID: ${this.contractId} (${this.contractTitle})`
      : 'Wallet Deposit / Account Funding';

    const baseAmountStr = this.contractId ? `Base Amount       : $${this.depositAmount.toFixed(2)}` : `Amount            : $${this.depositAmount.toFixed(2)}`;
    const platformFeeStr = this.contractId ? `Platform Fee (10%): $${(this.depositAmount * 0.10).toFixed(2)}` : 'Processing Fee    : $0.00';
    const totalAmount = this.contractId ? this.depositAmount * 1.10 : this.depositAmount;

    const receiptContent = `==================================================
TALENT HUB OFFICIAL TRANSACTION INVOICE
==================================================
Invoice Number    : ${this.invoiceNumber}
Order Reference   : ${this.orderId}
Transaction ID    : ${this.paymentId}
Payment Date      : ${this.paymentDate}
Payment Gateway   : Razorpay Secure${this.isSandbox ? ' (SANDBOX)' : ''}
Payment Method    : ${this.depositMethod.toUpperCase()}

CLIENT INFORMATION:
------------------
Name  : ${userName}
Email : ${userEmail || 'N/A'}

TRANSACTION DETAILS:
-------------------
Description       : ${description}
${baseAmountStr}
${platformFeeStr}
Total Charged     : $${totalAmount.toFixed(2)}
Status            : PAID & RELEASED

==================================================
Thank you for using Talent Hub.
Your transaction has been updated successfully.
==================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${this.invoiceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  goBack() {
    this.router.navigate(['/user/financial-summary']);
  }
}
