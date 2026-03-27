import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PortfolioService } from '../../../../core/services/portfolio-service';

@Component({
  selector: 'app-portfolio',
  imports: [RouterModule,CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
  standalone: true,
})
export class Portfolio  {

  constructor(private portfolioService: PortfolioService) {}

  projects: any[] = [];
  selectedProject: any = null;
  isEditMode = false;

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
  this.portfolioService.getProjects().subscribe({
    next: (res) => {
      this.projects = res.projects; // based on your API response
    },
    error: (err) => {
      console.error('Error loading projects:', err);
    }
  });
}



selectProject(project: any) {
  this.isEditMode = true;
  this.selectedProject = { ...project };
}

addProject() {
  this.isEditMode = false;
  this.selectedProject = {
    title: '',
    category: '',
    type: '',
    tags: [],
    description: '',
    image: '',
    demo: '',
    github: ''
  };
}


saveProject() {

  // convert tags string → array (important)
  if (typeof this.selectedProject.tags === 'string') {
    this.selectedProject.tags = this.selectedProject.tags.split(',').map((t: string) => t.trim());
  }

  if (this.isEditMode) {

    this.portfolioService.updateProjectById(
      this.selectedProject._id,
      this.selectedProject
    ).subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => console.error(err)
    });

  } else {

    this.portfolioService.createProjectUpload(this.selectedProject)
      .subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (err) => console.error(err)
      });

  }
}

deleteProject() {
  if (!this.selectedProject?._id) return;

  this.portfolioService.deleteProjectById(this.selectedProject._id)
    .subscribe({
      next: () => {
        this.loadProjects();
      },
      error: (err) => console.error(err)
    });
}


}
