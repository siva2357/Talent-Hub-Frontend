export interface Contract {

  // Core Contract
  _id: string;
  clientId: string;

  contractTitle: string;
  contractCategory?: string;
  contractSubject: string;
  contractDescription: string;

  industry?: string;
  contractType: string;

  currency: string;
  estimatedBudget: number;

  contractStartDate: string;
  contractEndDate: string;
  totalDuration?: string;

  status:
  | 'draft'
  | 'open'
  | 'in progress'
  | 'completed'
  | 'closed';

  // Client
  clientName?: string;
  clientEmail?: string;
  clientRole?: string;
  clientType?: string;
  website?: string;

  // Financial
  spent?: number;
  funded?: number;

  // Freelancer
  hasApplied?: boolean;
  hasSaved?: boolean;

  // Feedback
  feedbackSubmitted?: boolean;

  // AI Matching
  matchPercentage?: number;
  matchCategory?: string;
  matchReasoning?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}