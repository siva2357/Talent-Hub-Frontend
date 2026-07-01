// ========================================
// contract.dto.ts
// ========================================

export interface CreateContractDTO {
  contractTitle: string;
  estimatedBudget: number;
  contractStartDate: string;
  contractEndDate: string;
  contractDescription: string;
  contractType: string;
  contractSubject: string;
}

export interface UpdateContractDTO {
  contractTitle?: string;
  estimatedBudget?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  contractDescription?: string;
  contractType?: string;
  contractSubject?: string;
  status?: 'pending' | 'in progress' | 'completed';
}