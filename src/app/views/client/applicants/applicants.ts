import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { RecruitmentWorkflow } from '../recruitment-workflow/recruitment-workflow';

interface Applicant {
  applicationId: string;
  applicationStatus: string;
  offerStatus: string;
  freelancer: {
    _id: string;
    fullName: string;
    email: string;
    gender: string;
    availability: string[] | string;
    profilePhoto?: string;
  };
  avatarColor?: string;
}

@Component({
  selector: 'app-applicants',
  imports: [RouterLink, CommonModule, RecruitmentWorkflow],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css'
})
export class Applicants implements OnInit {
  applicants: Applicant[] = [];
  isLoading = true;
  contractId: string | null = null;
  totalApplicants = 0;
  selectedApplicantId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      if (this.contractId) {
        this.fetchApplicants();
      } else {
        this.isLoading = false;
      }
    });
  }

  fetchApplicants(): void {
    this.isLoading = true;
    this.contractService.getContractApplicants(this.contractId!).subscribe({
      next: (res) => {
        if (res.success) {
          this.applicants = res.applicants.map((app: any) => ({
            ...app,
            avatarColor: this.getRandomColor()
          }));
          this.totalApplicants = res.totalApplicants;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching applicants:', err);
        this.isLoading = false;
      }
    });
  }

  getRandomColor(): string {
    const colors = ['#5a5ce8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getAvailabilityString(availability: any): string {
    if (Array.isArray(availability)) {
      return availability.length > 0 ? availability[0] : 'Not specified';
    }
    return availability || 'Not specified';
  }

  openRecruitmentWorkflow(applicantId: string): void {
    this.selectedApplicantId = applicantId;
  }
}
