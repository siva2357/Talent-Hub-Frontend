export interface ResumeSummary {
  _id: string;
  resumeUrl: string;
  resumeScore?: number;
  hasScore: boolean;
  createdAt: string;
}


export interface ResumeListResponse {
  total: number;
  resumes: ResumeSummary[];
}


export interface ParsedResumeData {
  skills: string[];
  experienceYears?: number;
  education?: string[];
  projectsCount?: number;
  certificationsCount?: number;
  sectionsFound?: string[];
  wordCount?: number;
  hasEmail?: boolean;
  hasPhone?: boolean;
}

export interface ResumeScoreBreakdown {
  completeness: number;
  contentDepth: number;
  structure: number;
  consistency: number;
}

export interface ResumeFeedback {
  completeness: string[];
  contentDepth: string[];
  structure: string[];
  consistency: string[];
}

export interface ResumeReport {
  resumeId: string;
  resumeScore: number;
  scoreBreakdown: ResumeScoreBreakdown;
  parsedData: ParsedResumeData;
  feedback: ResumeFeedback;
  lastScoredAt: string;
}
