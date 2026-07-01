export interface SendOfferDto {
  scopeOfWork: string;
  additionalTerms: string;
  clientSignature?: string | null;
}

export interface ScheduleAssessmentDto {
  title: string;
  description: string;
  date: string;
}

export interface AssessmentResultDto {
  result: 'passed' | 'failed';
}

export interface ScheduleInterviewDto {
  title: string;
  description: string;
  date: string;
}

export interface InterviewResultDto {
  result: 'passed' | 'failed';
}
