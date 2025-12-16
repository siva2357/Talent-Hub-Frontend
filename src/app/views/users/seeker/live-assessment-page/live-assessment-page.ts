import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-live-assessment-page',
  imports: [RouterModule, FormsModule, MonacoEditorModule],
  templateUrl: './live-assessment-page.html',
  styleUrl: './live-assessment-page.css',
  standalone:true
})
export class LiveAssessmentPage {

  constructor(private router:Router){}


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

  changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.editorOptions = {
      ...this.editorOptions,
      language: lang
    };
  }

  runCode() {
    // UI only – no backend
    this.output = 'Code execution is disabled (UI only)';
  }

  submitTest() {
  // UI-only flow for now
  // Later you can send code, language, output to backend

  this.router.navigate(['/seeker/assessments']);
}


}
