import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  viewerRole: string = '';
  role: string = '';
  userData: any = null;
  profileData: any = null;
  contracts: any[] = [];
  diaries: any[] = [];
  portfolio: any[] = [];

  metrics: { active: number, completed: number, jobSuccess: number, hiringRisk: string } = {
    active: 0,
    completed: 0,
    jobSuccess: 0,
    hiringRisk: 'Low'
  };

  isLoading: boolean = true;
  error: string = '';
  isPublicView: boolean = false;
  fromParam: string = '';
  contractIdParam: string = '';
  backButtonText: string = 'Back';
  backUrl: string = '/dashboard';

  ngOnInit() {
    this.viewerRole = this.tokenService.getRole()?.toLowerCase() || '';

    combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, queryParams]) => {
      const targetId = params['id'] || queryParams['id'];
      this.fromParam = queryParams['from'] || '';
      this.contractIdParam = queryParams['contractId'] || '';

      if (targetId) {
        this.isPublicView = true;
        this.loadProfileData(targetId);
      } else {
        this.isPublicView = false;
        this.loadProfileData();
      }
    });
  }

  loadProfileData(id?: string) {
    this.isLoading = true;

    const request = id ? this.profileService.getProfileById(id) : this.profileService.getMyProfile();

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.user;
          this.profileData = res.profile;
          this.contracts = res.contracts || [];
          this.diaries = res.diaries || [];
          this.portfolio = res.portfolio || [];

          if (this.userData?.role) {
            this.role = this.userData.role.toLowerCase();
          } else if (!id) {
            this.role = this.viewerRole;
          }

          // Compute freelancer metrics
          const completed = this.diaries.filter((d: any) => d.status === 'completed' || d.status === 'closed').length;
          const active = this.diaries.filter((d: any) => d.status === 'active' || d.status === 'in progress' || d.status === 'open').length;
          const total = completed + active;
          const jobSuccess = total > 0 ? Math.round((completed / total) * 100) : 0;

          let hiringRisk = 'Medium';
          if (total === 0) {
            hiringRisk = 'Medium';
          } else if (jobSuccess >= 85) {
            hiringRisk = 'Low';
          } else if (jobSuccess >= 60) {
            hiringRisk = 'Medium';
          } else {
            hiringRisk = 'High';
          }

          this.metrics = { active, completed, jobSuccess, hiringRisk };

          // Compute client metrics if viewing client and not provided
          if (this.role === 'client') {
            const totalContracts = this.contracts.length;
            const completedContracts = this.contracts.filter(c => c.status === 'completed').length;
            const activeContracts = this.contracts.filter(c => c.status === 'in progress' || c.status === 'active' || c.status === 'open').length;
            const totalSpent = this.contracts.reduce((acc, c) => acc + (c.spent || c.estimatedBudget || 0), 0);

            if (!this.profileData) {
              this.profileData = {};
            }
            if (!this.profileData.metrics) {
              this.profileData.metrics = {
                totalContracts,
                completedContracts,
                activeContracts,
                totalSpent
              };
            }
          }

          this.updateNavigation();
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching profile:', err);
        this.error = 'Failed to load profile data.';
        this.isLoading = false;
      }
    });
  }

  updateNavigation() {
    const viewer = this.viewerRole;
    const profileRole = this.role;
    const from = this.fromParam;

    if (viewer === 'admin') {
      if (profileRole === 'client' || from === 'client-management') {
        this.backButtonText = 'Back to Client Management';
        this.backUrl = '/client-management';
      } else if (profileRole === 'freelancer' || from === 'freelancer-management') {
        this.backButtonText = 'Back to Freelancer Management';
        this.backUrl = '/freelancer-management';
      } else {
        this.backButtonText = 'Back to Dashboard';
        this.backUrl = '/dashboard';
      }
    } else if (viewer === 'client') {
      if (this.isPublicView) {
        if (from === 'search-talent') {
          this.backButtonText = 'Back to Search Talent';
          this.backUrl = '/search-talent';
        } else if (from === 'applicants') {
          this.backButtonText = 'Back to Applicants';
          this.backUrl = this.contractIdParam ? `/applicants/${this.contractIdParam}` : '/manage-contract';
        } else {
          this.backButtonText = 'Back to Search';
          this.backUrl = '/search-talent';
        }
      } else {
        this.backButtonText = 'Back to Dashboard';
        this.backUrl = '/dashboard';
      }
    } else if (viewer === 'freelancer') {
      this.backButtonText = 'Back to Dashboard';
      this.backUrl = '/dashboard';
    } else {
      this.backButtonText = 'Back';
      this.backUrl = '/dashboard';
    }
  }

  goBack() {
    if (this.fromParam === 'applicants' && this.contractIdParam) {
      this.router.navigate(['/applicants', this.contractIdParam]);
    } else if (this.fromParam && this.backUrl) {
      this.router.navigateByUrl(this.backUrl);
    } else if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.backUrl);
    }
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getAvatarInitial(): string {
    const name = this.profileData?.basicInformation?.fullName || this.userData?.fullName || 'User';
    return name.trim().charAt(0).toUpperCase();
  }
}
