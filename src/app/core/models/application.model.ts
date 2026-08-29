export interface Applicant {
  applicationId: string;
  applicationStatus: string;
  offerStatus: string;
  freelancer: {
    _id: string;
    fullName: string;
    email: string;
    gender: string;
    availability: string[] | string;
    profilePhoto?: string;
    city?: string;
    professionalHeadline?: string;
  };
  avatarColor?: string;
  index?: number;
}

export interface AppliedContract {
  applicationId: string;
  applicationStatus: string;
  appliedAt: string;
  assessment?: any;
  interview?: any;
  contract: {
    _id: string;
    contractTitle: string;
    budgetType?: string;
    estimatedBudget: number;
    contractDescription: string;
    contractStartDate: string;
    contractEndDate: string;
    contractType: string;
    contractSubject: string;
    createdAt: string;
  };
}
