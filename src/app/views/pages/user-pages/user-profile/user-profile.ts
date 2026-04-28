import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';
import { RecruiterProfileService } from '../../../../core/services/recruiter-profile-service';
import { SeekerProfileService } from '../../../../core/services/seeker-profile-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  profile: any = null;
  role: string | null = null;
  isLoading = false;
profileData: any = null;

  constructor(
    private recruiterService: RecruiterProfileService,
    private jobSeekerService: SeekerProfileService,
    private authService: AuthService,
     private router: Router,
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadProfile();
  }


      goBack(): void {
    const role = this.authService.getRole();

    if (role === 'recruiter') {
      this.router.navigate(['/user/my-jobposts']);
    } else if (role === 'jobSeeker') {
      this.router.navigate(['/user/jobprofile']);
    } else {
      this.router.navigate(['/']); // fallback
    }
  }




  loadProfile(): void {
    this.isLoading = true;

    if (this.role === 'recruiter') {
      this.recruiterService.getRecruiterProfile().subscribe({
        next: (res) => {
          this.profile = res.data;
            this.profileData = res.data.profile; // ✅ CLEAN
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    } else if (this.role === 'jobSeeker') {
      this.jobSeekerService.getJobSeekerProfile().subscribe({
        next: (res) => {
          this.profile = res.data;
            this.profileData = res.data.profile; // ✅ CLEAN
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    }
  }
}
