import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-making',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './resume-making.html',
  styleUrl: './resume-making.css'
})
export class ResumeMaking {

  selectedTemplate = 'classic';
  activeStep = 0;

  resumeForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTemplate = params['template'] || 'classic';
    });

    this.resumeForm = this.fb.group({
      basic: this.fb.group({
        fullName: [''],
        title: [''],
        email: [''],
        phone: ['']
      }),
      summary: this.fb.group({
        text: ['']
      }),
      experience: this.fb.group({
        company: [''],
        role: ['']
      }),
      education: this.fb.group({
        degree: [''],
        institute: ['']
      }),
      skills: this.fb.group({
        list: ['']
      })
    });
  }

nextStep() {
  if (this.activeStep < 4) {
    this.activeStep++;
  }
}

goToStep(step: number) {
  this.activeStep = step;
}

}
