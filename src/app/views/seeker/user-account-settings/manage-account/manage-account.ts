import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeekerProfileService } from '../../../../core/services/seeker-profile-service';
import { AuthService } from '../../../../core/services/auth-service';


@Component({
  selector: 'app-manage-account',
  standalone: true,
  templateUrl: './manage-account.html',
  styleUrl: './manage-account.css'
})
export class ManageAccount implements OnInit {

  loading = false;
  errorMessage: string | null = null;
  userDetails: any;

  constructor(
    private profileService:  SeekerProfileService ,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userData');
    this.userDetails = storedUser ? JSON.parse(storedUser) : null;
  }

  deleteAccount(): void {
    const confirmed = confirm(
      'Deleting your account is permanent. Your profile and all data will be removed. Continue?'
    );

    if (!confirmed) return;
    this.loading = true;
    this.profileService.deleteJobSeekerAccount().subscribe({
      next: () => {
        alert('Your job seeker account has been deleted successfully.');
        localStorage.clear();
        sessionStorage.clear();
        this.authService.logout?.();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Delete account failed:', err);
        this.errorMessage = 'Failed to delete account. Please try again.';
        this.loading = false;
      }
    });
  }
}
