export interface McqQuestion {
  _id: string;
  question: string;
  options: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface McqAnswer {
  questionId: string;
  selectedOption: number;
}


export interface CodingTestCase {
  input: string;
  expectedOutput: string;
}

export interface CodingQuestionResponse {
  id: string;
  problemStatement: string;
  starterCode: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: CodingTestCase[];
}

export interface GetCodingQuestionsResponse {
  codingQuestions: CodingQuestionResponse[];
}



export interface CodingResult {
  input: string;
  expectedOutput: string;
  output: string;
  passed: boolean;
}


export interface CodingAnswer {
  questionId: string;
  language: string;
  code: string;
  testCases: CodingTestCase[];
  results: CodingResult[];
}




export interface AssessmentReport {
  jobSeeker: {
    _id: string;
    registrationDetails: {
      fullName: string;
      email: string;
    };
  };

  job: {
    _id: string;
    jobTitle: string;
    jobId: string;
  };

  jobCategory: string;
  jobTitle: string;

  mcq: {
    score: number;
    total: number;
    percentage: number;
  };

  coding: {
    score: number;
    total: number;
    percentage: number;
  } | null;

  overallPercentage: number;
  eligibleForInterview: boolean;
  submittedAt: string;
}


export interface JobCategoryAnalytics {
  jobCategory: string;
  jobs: {
    jobTitle: string;
    totalCandidates: number;
    eligibleCount: number;
    jobSeekers: {
      jobSeekerId: string;
      name: string;
      mcqPercentage: number;
      codingPercentage: number;
      overallPercentage: number;
      eligibleForInterview: boolean;
    }[];
  }[];
}
