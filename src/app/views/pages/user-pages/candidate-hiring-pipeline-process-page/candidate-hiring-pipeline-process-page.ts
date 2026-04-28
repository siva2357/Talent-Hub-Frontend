import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-hiring-pipeline-process-page',
  imports: [CommonModule],
  templateUrl: './candidate-hiring-pipeline-process-page.html',
  styleUrl: './candidate-hiring-pipeline-process-page.css',
})
export class CandidateHiringPipelineProcessPage  {

totalCategories = 5;
totalJobs = 25;
totalApplicants = 250;
totalShortlisted = 120;
totalHired = 30;
totalRejected = 90;




  selectedJob: any;

  jobCategories = [
    {
      name: 'Frontend',
      jobs: this.generateJobs('FE')
    },
    {
      name: 'Backend',
      jobs: this.generateJobs('BE')
    },
    {
      name: 'Full Stack',
      jobs: this.generateJobs('FS')
    },
    {
      name: 'UI/UX',
      jobs: this.generateJobs('UX')
    },
    {
      name: 'DevOps',
      jobs: this.generateJobs('DO')
    }
  ];

  generateJobs(prefix: string) {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `${prefix}-${i + 1}`,
      role: `${prefix} Developer ${i + 1}`,
      status: 'Open',
      applicants: this.generateApplicants()
    }));
  }

  generateApplicants() {
    return Array.from({ length: 10 }).map((_, i) => ({
      name: `Applicant ${i + 1}`,
      applied: '2026-04-01',
      shortlisted: '2026-04-03',
      assessmentAssigned: '2026-04-05',
      assessmentCompleted: '2026-04-07',
      interviewScheduled: '2026-04-10',
      interviewCompleted: '2026-04-12',
      finalStatus: i % 2 === 0 ? 'Selected (Offer Released)' : 'Rejected'
    }));
  }

  openPipeline(job: any) {
    this.selectedJob = job;
  }




}
