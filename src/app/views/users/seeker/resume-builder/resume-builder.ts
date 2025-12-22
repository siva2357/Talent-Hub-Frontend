import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-resume-builder',
  imports: [RouterModule],
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.css',
  standalone:true
})
export class ResumeBuilder {
    selectedTemplate: string | null = null;

  constructor(private router: Router) {}

  selectTemplate(template: string) {
    this.selectedTemplate = template;
  }

  startBuilding() {
    if (!this.selectedTemplate) return;

    this.router.navigate(
      ['/seeker/resume-making'],
      {
        queryParams: {
          template: this.selectedTemplate
        }
      }
    );
  }

}
