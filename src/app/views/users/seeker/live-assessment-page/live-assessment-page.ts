import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AssessmentService } from '../../../../core/services/assessment-service';
import { CodeExecutionService } from '../../../../core/services/code-execution-service';

interface McqAnswer {
  questionId: string;
  selectedOption: number;
}

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
  this.saveCodingProgress();
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




  saveCodingProgress(): void {
  const saved = localStorage.getItem(`assessment_${this.assessmentId}`);
  const state = saved ? JSON.parse(saved) : {};

  localStorage.setItem(
    `assessment_${this.assessmentId}`,
    JSON.stringify({
      ...state,
      section: this.section,
      mcqAnswers: this.mcqAnswers,
      code: this.code,
      language: this.selectedLanguage
    })
  );
}

canRunCode(): boolean {
  return this.selectedLanguage === 'javascript'
      || this.selectedLanguage === 'python';
}


runCode(): void {
  this.output = 'Running...';

  this.codeService.runCode({
    language: this.selectedLanguage,
    code: this.code
  }).subscribe({
    next: res => {
      if (res.error) {
        this.output = res.error;
      } else {
        this.output = res.output || 'No output';
      }
    },
    error: err => {
      this.output = typeof err === 'string'
        ? err
        : 'Execution failed';
    }
  });

  this.saveCodingProgress();

}



submitTest(): void {
  const payload = {
    assessmentId: this.assessmentId,
    mcqAnswers: this.mcqAnswers,
    coding: {
      language: this.selectedLanguage,
      code: this.code
    }
  };

  console.log('FINAL SUBMIT PAYLOAD', payload);

  this.assessmentService.submitAssessment(payload).subscribe({
next: res => {
  localStorage.removeItem(`assessment_${this.assessmentId}`);
  this.router.navigate(['/jobSeeker/assessments']);
},
    error: err => {
      console.error('SUBMIT ERROR', err);
      alert(err);
    }
  });
}


}
