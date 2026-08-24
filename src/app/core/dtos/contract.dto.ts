export interface CreateContractDto {
  contractTitle: string;
  contractType: string;
  contractCategory?: string;
  contractSubject: string;
  contractDescription: string;
  contractStartDate: string;
  contractEndDate: string;
  status?: 'draft' | 'open';
  estimatedBudget: number;
  currency?: string;
}

export interface UpdateContractDto extends Omit<Partial<CreateContractDto>, 'status'> {
  status?: 'draft' | 'open' | 'in progress' | 'completed' | 'closed';
}
