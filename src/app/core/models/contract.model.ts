export interface Contract {
  _id: string;
  clientId: string;
  contractTitle: string;
  contractCategory?: string;
  currency: string;
  estimatedBudget: number;
  contractStartDate: string;
  contractEndDate: string;
  contractDescription: string;
  contractType: string;
  contractSubject: string;
  status: 'draft' | 'open' | 'in progress' | 'completed' | 'closed';
  spent?: number;
  funded?: number;
  clientName?: string;
  clientEmail?: string;
  clientRole?: string;
  clientType?: string;
  website?: string;
  industry?: string;
  totalDuration?: string;
  hasApplied?: boolean;
  hasSaved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractCardData {
  industry: string;
  contractTitle: string;
  estimatedBudget: number;
  contractDescription: string;
  contractStartDate: string;
  contractEndDate: string;
  contractType: string;
  contractSubject: string;
  totalDuration: string;
  status: string;
  hasApplied: boolean;
  hasSaved: boolean;
  _id?: string;
  matchPercentage?: number;
  matchCategory?: string;
}

export interface AIContractCardData extends ContractCardData {
  matchReasoning?: string;
}
