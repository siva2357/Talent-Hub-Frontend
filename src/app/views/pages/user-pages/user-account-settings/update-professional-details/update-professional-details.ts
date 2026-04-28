import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth-service';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';


@Component({
  selector: 'app-update-professional-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-professional-details.html',
  styleUrl: './update-professional-details.css'
})
export class UpdateProfessionalDetails implements OnInit {

  role: string | null = null;
  profile: any = {};
  isLoading = false;
  isSaving = false;

  constructor(
    private authService: AuthService,
    private seekerService: SeekerProfileService,
    private recruiterService: RecruiterProfileService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadProfessionalDetails();
  }

  loadProfessionalDetails(): void {
    this.isLoading = true;

    if (this.role === 'jobSeeker') {
      this.seekerService.getJobSeekerProfessional().subscribe({
        next: (res) => {
          this.profile = res.data;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    } else if (this.role === 'recruiter') {
      this.recruiterService.getRecruiterProfessional().subscribe({
        next: (res) => {
          this.profile = res.data;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    }
  }

  updateProfessional(): void {
    this.isSaving = true;

    if (this.role === 'JobSeeker') {
      this.seekerService.updateJobSeekerProfessional(this.profile).subscribe({
        next: () => {
          this.isSaving = false;
          alert('Professional details updated');
        },
        error: () => (this.isSaving = false),
      });
    } else if (this.role === 'Recruiter') {
      this.recruiterService.updateRecruiterProfessional(this.profile).subscribe({
        next: () => {
          this.isSaving = false;
          alert('Professional details updated');
        },
        error: () => (this.isSaving = false),
      });
    }
  }
}
