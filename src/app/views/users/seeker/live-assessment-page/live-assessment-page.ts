import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { CodeExecutionService } from '../../../../core/services/code-execution-service';
import { CodingAnswer, CodingResult, McqAnswer } from '../../../../core/models/assessment.model';



@Component({
  selector: 'app-live-assessment-page',
  standalone: true,
  imports: [RouterModule, FormsModule, MonacoEditorModule],
  templateUrl: './live-assessment-page.html',
  styleUrl: './live-assessment-page.css'
})
export class LiveAssessmentPage implements OnInit {

  /* =====================
     BASIC STATE
  ====================== */
  assessmentId!: string;
  section: 'mcq' | 'coding' = 'mcq';

  /* =====================
     MCQ SECTION
  ====================== */
  mcqs: any[] = [];
  mcqAnswers: McqAnswer[] = [];

  /* =====================
     CODING SECTION (UI ONLY)
  ====================== */
  selectedLanguage = 'javascript';
  code = `// Write your code here
function solution(input) {
  return input;
}`;
  output = '';

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
    minimap: { enabled: false }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assessmentService: AssessmentService,
    private codeService:CodeExecutionService
  ) {}

  /* =====================
     INIT
  ====================== */
ngOnInit(): void {
  this.assessmentId =
    this.route.snapshot.queryParamMap.get('assessmentId') || '';

  if (!this.assessmentId) {
    this.router.navigate(['/jobSeeker/assessments']);
    return;
  }

  const saved = localStorage.getItem(`assessment_${this.assessmentId}`);

  if (saved) {
    const state = JSON.parse(saved);

    this.section = state.section || 'mcq';
    this.mcqAnswers = state.mcqAnswers || [];
    this.code = state.code || this.code;
    this.selectedLanguage = state.language || 'javascript';

    this.editorOptions = {
      ...this.editorOptions,
      language: this.selectedLanguage
    };
  }

  this.fetchMcqs();
    this.fetchCodingQuestions(); // 👈 ADD THIS
}

  /* =====================
     MCQ LOGIC
  ====================== */
  fetchMcqs(): void {
    this.assessmentService
      .getAssessmentMcqs(this.assessmentId)
      .subscribe(res => {
        this.mcqs = res.mcqs || [];
      });
  }

selectOption(questionId: string, optionIndex: number): void {
  console.log('CLICKED', questionId, optionIndex);

  const existing = this.mcqAnswers.find(a => a.questionId === questionId);

  if (existing) {
    existing.selectedOption = optionIndex;
  } else {
    this.mcqAnswers.push({ questionId, selectedOption: optionIndex });
  }

  console.log('mcqAnswers NOW =>', this.mcqAnswers);
}


  isOptionSelected(questionId: string, optionIndex: number): boolean {
    const answer = this.mcqAnswers.find(a => a.questionId === questionId);
    return answer?.selectedOption === optionIndex;
  }

goToCodingSection(): void {
  if (this.mcqAnswers.length !== this.mcqs.length) {
    alert('Please answer all MCQs before continuing');
    return;
  }

  this.section = 'coding';
  this.fetchCodingQuestions();

  localStorage.setItem(
    `assessment_${this.assessmentId}`,
    JSON.stringify({
      section: 'coding',
      mcqAnswers: this.mcqAnswers,
      code: this.code,
      language: this.selectedLanguage
    })
  );
}



/* =====================
   CODING DATA (FROM API)
====================== */


problemStatement = '';
hasCodingQuestion = false;


codingQuestions: any[] = [];
currentCodingIndex = 0;
codingAnswers: CodingAnswer[] = [];




fetchCodingQuestions(): void {
  this.assessmentService
    .getCodingQuestion(this.assessmentId)
    .subscribe({
      next: res => {
        this.codingQuestions = res.codingQuestions || [];

        if (this.codingQuestions.length > 0) {
          this.hasCodingQuestion = true;

          this.codingAnswers = this.codingQuestions.map(q => ({
            questionId: q.id,
            language: this.selectedLanguage,
            code: q.starterCode || '',
            testCases: q.testCases || [],
            results: []
          }));

          this.loadCurrentCodingQuestion();
        }
      },
      error: () => {
        this.hasCodingQuestion = false;
      }
    });
}



loadCurrentCodingQuestion(): void {
  const q = this.codingQuestions[this.currentCodingIndex];
  const answer = this.codingAnswers[this.currentCodingIndex];

  if (!q || !answer) return;

  this.problemStatement = q.problemStatement;
  this.selectedLanguage = answer.language;
  this.code = answer.code;

  this.editorOptions = {
    ...this.editorOptions,
    language: this.selectedLanguage
  };
}


nextCoding(): void {
  this.saveCurrentCodingAnswer();

  if (this.currentCodingIndex < this.codingQuestions.length - 1) {
    this.currentCodingIndex++;
    this.loadCurrentCodingQuestion();
  }
}

prevCoding(): void {
  this.saveCurrentCodingAnswer();

  if (this.currentCodingIndex > 0) {
    this.currentCodingIndex--;
    this.loadCurrentCodingQuestion();
  }
}




changeLanguage(lang: string): void {
  this.selectedLanguage = lang;

  const monacoLang =
    lang === 'nosql' ? 'javascript' :
    lang === 'sql' ? 'sql' :
    lang;

  this.editorOptions = {
    ...this.editorOptions,
    language: monacoLang
  };

  this.code = this.getStarterCode(lang);
  this.saveCurrentCodingAnswer();
}

getStarterCode(lang: string): string {
  switch (lang) {
    case 'python':
      return `def solution(input):
    return input`;

    case 'java':
      return `public class Main {
  public static void main(String[] args) {
    // write your logic here
  }
}`;

    case 'sql':
      return `-- Write SQL query only
SELECT * FROM users;`;

    case 'nosql':
      return `// MongoDB query example
db.users.find({ active: true })`;

    default:
      return `function solution(input) {
  return input;
}`;
  }
}



saveCurrentCodingAnswer(): void {
  const answer = this.codingAnswers[this.currentCodingIndex];
  if (!answer) return;

  answer.code = this.code;
  answer.language = this.selectedLanguage;
}


canRunCode(): boolean {
  return this.selectedLanguage === 'javascript'
      || this.selectedLanguage === 'python';
}


runCode(): void {
  this.output = 'Running test cases...';

  const current: CodingAnswer | undefined =
    this.codingAnswers[this.currentCodingIndex];

  if (!current) return;

  this.codeService.runCode({
    language: this.selectedLanguage,
    code: this.code,
    testCases: current.testCases
  }).subscribe({
    next: (res: { results: CodingResult[] }) => {
      current.results = res.results;

      const passed = current.results.every(
        (r: CodingResult) => r.passed
      );

      this.output = passed
        ? '✅ All test cases passed'
        : '❌ Some test cases failed';
    },
    error: () => {
      this.output = 'Execution failed';
    }
  });

  this.saveCurrentCodingAnswer();
}




goToQuestion(index: number): void {
  this.saveCurrentCodingAnswer();
  this.currentCodingIndex = index;
  this.loadCurrentCodingQuestion();

  setTimeout(() => {
    const active = document.querySelector('.question-list li.active');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}


submitTest(): void {
  this.saveCurrentCodingAnswer();

  const payload = {
    assessmentId: this.assessmentId,
    mcqAnswers: this.mcqAnswers,
    coding: this.codingAnswers // 👈 ARRAY
  };

  this.assessmentService.submitAssessment(payload).subscribe({
    next: () => {
      localStorage.removeItem(`assessment_${this.assessmentId}`);
      this.router.navigate(['/jobSeeker/assessments']);
    },
    error: err => {
      alert(err);
    }
  });
}


}
