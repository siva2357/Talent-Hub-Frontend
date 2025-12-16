import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-practice-topic-page',
  imports: [RouterModule, FormsModule, MonacoEditorModule],
  templateUrl: './practice-topic-page.html',
  styleUrl: './practice-topic-page.css',
  standalone:true
})
export class PracticeTopicPage {

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
}
