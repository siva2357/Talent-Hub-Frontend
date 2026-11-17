export interface JobCardData {
  _id: string;
  jobCode: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  department: string;
  industry: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-Time' | 'Contract-to-Hire' | 'Internship';
  experienceRange: string;
  salaryRange: string;
  jobDescription: string;
  skills: string[];
  postedDate: string;
  applicationDeadline: string;
  openings: number;
  portalSource?: string;
  hasApplied: boolean;
  hasSaved: boolean;
  matchPercentage?: number;
  matchCategory?: 'High' | 'Average' | 'Low';
}

export interface JobDetailsExtended extends JobCardData {
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  hiringStages: string[];
  companyOverview: {
    size: string;
    website: string;
    headquarters: string;
    about: string;
  };
}

export interface JobApplicationRecord {
  applicationId: string;
  jobId: string;
  jobCode: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  department: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: string;
  salaryRange: string;
  appliedDate: string;
  portalSource: string;
  jobStatus: 'Open' | 'Closed';
  applicationStatus:
    | 'Application Submitted'
    | 'Shortlisted'
    | 'Assessment Assigned'
    | 'Interview Scheduled'
    | 'Offer Released'
    | 'Rejected'
    | 'Withdrawn';
}

export interface AssessmentCardData {
  _id: string;
  assessmentCode: string;
  assessmentTitle: string;
  assessmentType: 'Coding Challenge' | 'System Design' | 'MCQ & Aptitude' | 'AI Technical Round';
  jobId: string;
  jobCode: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  description: string;
  skillsTested: string[];
  durationMinutes: number;
  totalQuestions: number;
  passingScore: string;
  assignedDate: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Expired';
  score?: string;
  assessmentLink: string;
  portalSource: string;
}

export interface OfferLetterCardData {
  _id: string;
  offerCode: string;
  jobId: string;
  jobCode: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-Time' | 'Contract-to-Hire';
  annualCtc: string;
  fixedPay: string;
  variableBonus: string;
  joiningDate: string;
  issuedDate: string;
  expiryDate: string;
  reportingManager: string;
  probationPeriod: string;
  noticePeriod: string;
  benefits: string[];
  offerLetterUrl: string;
  portalSource: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

