import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { JobDetailsExtended } from '../../../core/models/job.model';
import { STATIC_WORKSPHERE_JOBS } from '../find-jobs-page/find-jobs-page';

@Component({
  selector: 'app-job-details-page',
  standalone: true,
  imports: [CommonModule, RouterLink, Button, Badge, StatCard],
  templateUrl: './job-details-page.html',
  styleUrl: './job-details-page.css'
})
export class JobDetailsPage implements OnInit {
  jobId: string | null = null;
  job: JobDetailsExtended | null = null;
  isLoading = false;
  isApplying = false;
  isApplied = false;
  isSaved = false;
  actionMessage: string | null = null;

  constructor(private route: ActivatedRoute) {}

  get jobStats(): StatCardData[] {
    if (!this.job) return [];
    return [
      { title: 'CTC / Compensation', value: this.job.salaryRange, icon: 'bi-wallet2' },
      { title: 'Experience Required', value: this.job.experienceRange, icon: 'bi-briefcase' },
      { title: 'Work Mode', value: `${this.job.workMode} (${this.job.employmentType})`, icon: 'bi-geo-alt' },
      { title: 'Department', value: this.job.department, icon: 'bi-diagram-3' },
      { title: 'Total Openings', value: `${this.job.openings} Positions`, icon: 'bi-people' },
      { title: 'Apply Before', value: new Date(this.job.applicationDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), icon: 'bi-calendar-event' }
    ];
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.loadStaticJobDetails(this.jobId || 'ws-job-101');
  }

  loadStaticJobDetails(id: string): void {
    const baseJob = STATIC_WORKSPHERE_JOBS.find(j => j._id === id) || STATIC_WORKSPHERE_JOBS[0];
    this.isApplied = baseJob.hasApplied;
    this.isSaved = baseJob.hasSaved;

    this.job = {
      ...baseJob,
      responsibilities: [
        `Architect, build, and maintain scalable modules for ${baseJob.companyName}'s ${baseJob.department} platform.`,
        'Collaborate with product managers, UI/UX designers, and backend engineers to deliver end-to-end features.',
        'Optimize application performance, bundle sizes, and API response handling across enterprise workflows.',
        'Participate in code reviews, system design discussions, and mentor junior engineers on best practices.'
      ],
      requirements: [
        `${baseJob.experienceRange} of hands-on software engineering experience in production environments.`,
        `Strong proficiency in ${baseJob.skills.slice(0, 4).join(', ')}.`,
        'Experience with modern CI/CD pipelines, automated testing, and agile engineering practices.',
        'B.Tech / M.Tech / MCA in Computer Science or equivalent practical industry experience.'
      ],
      benefits: [
        'Comprehensive family health & wellness insurance coverage',
        'Annual learning & certification stipend + conference sponsorship',
        'Flexible hybrid/remote work allowance & home-office setup budget',
        'Performance bonus & ESOP opportunities via Worksphere partner program'
      ],
      hiringStages: [
        'Resume & Profile Screening (Worksphere AI Match)',
        'Online Technical Assessment (90 mins)',
        'Technical & System Design Interview',
        'Managerial & Culture Fit Round',
        'Direct Offer Letter Release'
      ],
      companyOverview: {
        size: '500 - 1,000 Employees',
        website: `https://www.${baseJob.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
        headquarters: baseJob.location,
        about: `${baseJob.companyName} is a verified Worksphere enterprise partner in the ${baseJob.industry} sector, building next-generation digital products for global customers.`
      }
    };
  }

  applyForJob(): void {
    if (!this.job) return;
    this.isApplying = true;
    this.actionMessage = null;

    setTimeout(() => {
      this.isApplying = false;
      this.isApplied = true;
      this.job!.hasApplied = true;
      this.actionMessage = `Your application has been submitted directly to ${this.job!.companyName}'s Worksphere portal!`;
    }, 500);
  }

  withdrawApplication(): void {
    if (!this.job) return;
    this.isApplying = true;
    this.actionMessage = null;

    setTimeout(() => {
      this.isApplying = false;
      this.isApplied = false;
      this.job!.hasApplied = false;
      this.actionMessage = 'Your job application has been withdrawn.';
    }, 400);
  }

  toggleSave(): void {
    if (!this.job) return;
    this.isSaved = !this.isSaved;
    this.job.hasSaved = this.isSaved;
  }
}
