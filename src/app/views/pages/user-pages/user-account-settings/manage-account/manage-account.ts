import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { StorageService } from '../../../../../core/services/storage.service';


@Component({
  selector: 'app-manage-account',
  standalone: true,
  templateUrl: './manage-account.html',
  styleUrl: './manage-account.css',
})
export class ManageAccount implements OnInit {

  loading = false;
  errorMessage: string | null = null;
  userDetails: any;
  role: string | null = null;


constructor(
  private seekerService: SeekerProfileService,
  private recruiterService: RecruiterProfileService,
  private authService: AuthService,
  private router: Router,
  private storage: StorageService
) {}

ngOnInit(): void {
  this.role = this.authService.getRole();

  const storedUser = this.storage.get('userData');
  this.userDetails = storedUser ? JSON.parse(storedUser) : null;
}

  deleteAccount(): void {
    const confirmed = confirm(
      'Deleting your account is permanent. Your profile and all data will be removed. Continue?'
    );

    if (!confirmed) return;

    this.loading = true;

    if (this.role === 'jobSeeker') {
      this.seekerService.deleteJobSeekerAccount().subscribe({
        next: () => this.handleSuccess('Job seeker account deleted'),
        error: (err) => this.handleError(err),
      });

    } else if (this.role === 'recruiter') {
      this.recruiterService.deleteRecruiterAccount().subscribe({
        next: () => this.handleSuccess('Recruiter account deleted'),
        error: (err) => this.handleError(err),
      });
    }
  }

private handleSuccess(message: string): void {
  alert(message);

  this.storage.clear(); // ✅ replaces localStorage
  sessionStorage.clear(); // ⚠️ optional (SSR safe since no-op on server)

  this.authService.logout?.();
  this.router.navigate(['/login']);
}

  private handleError(err: any): void {
    console.error('Delete account failed:', err);
    this.errorMessage = 'Failed to delete account. Please try again.';
    this.loading = false;
  }
}
