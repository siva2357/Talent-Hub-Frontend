import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-basic-details',
  standalone: true,
  templateUrl: './update-basic-details.html',
  styleUrl: './update-basic-details.css',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
})
export class UpdateBasicDetails implements OnInit {
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
    this.loadBasicDetails();
  }

  loadBasicDetails(): void {
    this.isLoading = true;

    if (this.role === 'jobSeeker') {
      this.seekerService.getJobSeekerBasicDetails().subscribe({
        next: (res) => {
          this.profile = res.data;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    } else if (this.role === 'recruiter') {
      this.recruiterService.getRecruiterBasicDetails().subscribe({
        next: (res) => {
          this.profile = res.data;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    }
  }

  updateProfile(): void {
    this.isSaving = true;

    if (this.role === 'JobSeeker') {
      this.seekerService.updateJobSeekerBasicDetails(this.profile).subscribe({
        next: () => {
          this.isSaving = false;
          alert('Profile updated successfully');
        },
        error: () => (this.isSaving = false),
      });
    } else if (this.role === 'Recruiter') {
      this.recruiterService.updateRecruiterBasicDetails(this.profile).subscribe({
        next: () => {
          this.isSaving = false;
          alert('Profile updated successfully');
        },
        error: () => (this.isSaving = false),
      });
    }
  }
}
