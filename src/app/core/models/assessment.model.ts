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
