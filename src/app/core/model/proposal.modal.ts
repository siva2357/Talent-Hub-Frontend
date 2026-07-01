export interface AppliedContractsResponse {

  success: boolean;

  totalApplications: number;

  applications: AppliedApplication[];

}

export interface AppliedApplication {

  applicationId: string;

  applicationStatus: string;

  offerStatus?: string;

  appliedAt: string;

  assessment: Assessment;

  interview: Interview;

  contract: AppliedContract;

  client: AppliedClient;

}

export interface Assessment {

  title: string;

  description: string;

  status: string;

  date?: string;

}

export interface Interview {

  title: string;

  description: string;

  status: string;

  feedback: string;

  date?: string;

}

export interface AppliedContract {

  _id: string;

  contractTitle: string;

  budgetType: 'Fixed Price' | 'Hourly Rate';

  estimatedBudget: number;

  contractType: string;

  contractSubject: string;

  contractDescription: string;

  contractStartDate: string;

  contractEndDate: string;

  status: string;

  totalApplicants: number;

  createdAt: string;

}

export interface AppliedClient {

  _id: string;

  fullName: string;

  email: string;

}



export interface Proposal {
  id: string;

  contractId: string;

  contractTitle: string;

  client: string;

  date: string;

  budget: string;

  budgetLabel: string;

  duration: string;

  type:
    | 'Applied'
    | 'Assignment'
    | 'Interview'
    | 'Shortlisted'
    | 'Rejected';

  contractType: string;

  contractSubject: string;

  level:
    | 'Entry'
    | 'Intermediate'
    | 'Expert';

  description: string;


  status: string;

  assessment: Assessment;

  interview: Interview;

  deadline?: string;

  link?: string;

  meetingTime?: string;
}
