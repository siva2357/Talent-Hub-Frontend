import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';
import { RecruiterProfileService } from '../../../../core/services/recruiter-profile-service';
import { SeekerProfileService } from '../../../../core/services/seeker-profile-service';
import { Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin-service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  profile: any = null;
  profileData: any = null;
  role: string | null = null;
  isLoading = true;

  constructor(
    private recruiterService: RecruiterProfileService,
    private jobSeekerService: SeekerProfileService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef // ✅ fix for NG0100
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();

    // ✅ avoid NG0100
    setTimeout(() => {
      this.loadProfile();
    });
  }

  goBack(): void {
    if (this.role === 'recruiter') {
      this.router.navigate(['/user/my-dashboard']);
    } else if (this.role === 'jobSeeker') {
      this.router.navigate(['/user/jobprofile']);
    } else {
      this.router.navigate(['/user/dashboard']);
    }
  }

  loadProfile(): void {
    this.isLoading = true;

    if (this.role === 'recruiter') {
      this.recruiterService.getRecruiterProfile().subscribe({
        next: (res) => this.handleResponse(res),
        error: () => (this.isLoading = false),
      });

    } else if (this.role === 'jobSeeker') {
      this.jobSeekerService.getJobSeekerProfile().subscribe({
        next: (res) => this.handleResponse(res),
        error: () => (this.isLoading = false),
      });

    } else if (this.role === 'admin') {
      this.adminService.getAdminById().subscribe({
        next: (res) => {
          this.profile = res.data;
          this.profileData = res.data.registrationDetails; // ✅ admin fix
          this.isLoading = false;
          this.cd.detectChanges(); // ✅ fix change detection
        },
        error: () => (this.isLoading = false),
      });
    }
  }

  // ✅ common handler for recruiter & seeker
  handleResponse(res: any) {
    this.profile = res.data;
    this.profileData = res.data.profile;
    this.isLoading = false;
    this.cd.detectChanges(); // ✅ ensures UI updates safely
  }
}
