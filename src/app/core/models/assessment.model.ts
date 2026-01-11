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
