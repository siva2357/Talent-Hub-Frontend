import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AssessmentService } from '../../../../core/services/assessment-service';

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
    private assessmentService: AssessmentService
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

  // lock MCQs & move forward
  this.section = 'coding';
}


  /* =====================
     CODING LOGIC (UI ONLY)
  ====================== */
  changeLanguage(lang: string): void {
    this.selectedLanguage = lang;
    this.editorOptions = {
      ...this.editorOptions,
      language: lang
    };
    this.code = this.getStarterCode(lang);
  }

  getStarterCode(lang: string): string {
    switch (lang) {
      case 'python':
        return `def solution(input):
    return input`;

      case 'java':
        return `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`;

      case 'sql':
        return `-- Write your SQL query here
SELECT * FROM users;`;

      default:
        return `function solution(input) {
  return input;
}`;
    }
  }

  runCode(): void {
    this.output = 'Code execution is disabled (UI only)';
  }

  /* =====================
     SUBMIT
  ====================== */
submitTest(): void {
  console.log('FINAL SUBMIT PAYLOAD', {
    assessmentId: this.assessmentId,
    mcqAnswers: this.mcqAnswers
  });

  this.assessmentService.submitAssessment({
    assessmentId: this.assessmentId,
    mcqAnswers: this.mcqAnswers
  }).subscribe({
    next: res => {
      console.log('SUBMIT SUCCESS', res);
      this.router.navigate(['/jobSeeker/assessments']);
    },
    error: err => {
      console.error('SUBMIT ERROR', err);
    }
  });
}

}
