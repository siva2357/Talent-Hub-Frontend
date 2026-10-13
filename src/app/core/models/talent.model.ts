export interface TalentCardData {
  _id: string;
  userId: string;
  profilePhoto: string;
  fullName: string;
  email: string;
  gender: string;
  categories: string[];
  skills: string[];
  country: string;
  city: string;
  state: string;
  availability: string[];
  createdAt: string;
  updatedAt: string;
  activeContracts: number;
  completedContracts: number;
  jobSuccessRate?: number;
  riskStatus?: string;
  isSaved: boolean;
  status: string;
  matchPercentage?: number;
  matchCategory?: string;
  matchReasoning?: string;
}
