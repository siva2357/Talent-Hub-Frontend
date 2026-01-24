import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio-service';
import { Projects } from '../../../../core/models/portfolio.model';
import { CommonModule } from '@angular/common';
declare const bootstrap: any;

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details-page.html',
  styleUrl: './project-details-page.css',
})

export class ProjectDetailsPage implements OnInit {

@ViewChild('thumbScroll') thumbScroll!: ElementRef<HTMLDivElement>;
  projectId!: string;
  project!: Projects;
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
  }

  loadProject(): void {
    this.portfolioService.getProjectById(this.projectId).subscribe({
      next: (res) => {
        this.project = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.isLoading = false;
      }
    });
  }



goBack() {
  this.router.navigate(['/jobSeeker/my-portfolio']);
}
}


