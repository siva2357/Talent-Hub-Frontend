// ========================================
// contract.dto.ts
// ========================================

export interface CreateContractDTO {
  contractTitle: string;
  budgetType: 'Fixed Price' | 'Hourly Rate';
  estimatedBudget: number;
  contractStartDate: string;
  contractEndDate: string;
  contractDescription: string;
}

export interface UpdateContractDTO {
  contractTitle?: string;
  budgetType?: 'Fixed Price' | 'Hourly Rate';
  estimatedBudget?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  contractDescription?: string;
  status?: 'pending' | 'in progress' | 'completed';
}