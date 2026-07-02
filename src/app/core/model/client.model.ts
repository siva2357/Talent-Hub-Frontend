export interface Milestone {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: string;
  invoiceId?: string;
}

export interface ContractTransactions {
  id: string;
  diaryId: string;
  contractId: string;
  title: string;
  freelancer: string;
  type: string;
  budget: number;
  totalTransacted: number;
  milestones: Milestone[];
}

export interface CompletedContract {
  contractId: string;
  title: string;
  type: string;
  freelancer: string;
  startDate: string;
  endDate: string;
  budget: number;
  totalPaid: number;
  status: string;
}

export interface Invoice {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  amount: number;
  estimatedBudget?: number;
  status: string;
  type: string;
  contractType?: string;
  contractSubject?: string;
  remainingAmount: number;
}
