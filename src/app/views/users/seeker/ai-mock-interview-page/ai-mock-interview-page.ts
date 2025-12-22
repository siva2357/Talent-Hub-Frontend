import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-ai-mock-interview-page',
  imports: [RouterModule,ReactiveFormsModule ],
  templateUrl: './ai-mock-interview-page.html',
  styleUrl: './ai-mock-interview-page.css',
    standalone:true

})
export class AiMockInterviewPage {

  mockForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.mockForm = this.fb.group({
      topic: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  startMockSession() {
    if (this.mockForm.invalid) return;

    const sessionConfig = this.mockForm.value;

    // You can store this in service / state if needed
    this.router.navigate(
      ['/seeker/ai-mock/live-session'],
      { state: sessionConfig }
    );
  }
}
