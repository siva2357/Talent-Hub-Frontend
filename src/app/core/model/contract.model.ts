export interface Contract {
  _id: string;
  contractTitle: string;
  estimatedBudget: number;
  contractStartDate: string;
  contractEndDate: string;
  totalDuration:string;
  contractDescription: string;
  contractType: string;
  contractSubject: string;
  clientName: string;
  clientType: string;
  website: string;
  industry: string;
  techStack?: string[];
  status: 'pending' | 'in progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  hasSaved:boolean;
  hasApplied:boolean;
  totalApplicants?: number;
}


export interface ContractResponse {
  success: boolean;
  message?: string;
  contract: Contract;
}

export interface ContractsResponse {
  success: boolean;
  totalContracts: number;
  contracts: Contract[];
}