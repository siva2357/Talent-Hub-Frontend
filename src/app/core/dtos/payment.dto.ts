export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  contractId: string;
  freelancerId: string;
  description?: string;
}

export interface VerifyPaymentRequest {
  paymentId: string;
  orderId: string;
  signature: string;
}
