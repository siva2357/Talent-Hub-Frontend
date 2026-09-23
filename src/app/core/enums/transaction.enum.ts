export enum TransactionStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export enum TransactionType {
  Payment = 'Payment',
  Refund = 'Refund',
  Withdrawal = 'Withdrawal',
  Deposit = 'Deposit'
}
