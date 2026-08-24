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
