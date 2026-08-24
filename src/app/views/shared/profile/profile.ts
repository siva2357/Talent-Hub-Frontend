import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);

  role: string = '';
  userData: any = null;
  profileData: any = null;
  contracts: any[] = [];
  diaries: any[] = [];
  portfolio: any[] = [];
  
  metrics: { active: number, completed: number, jobSuccess: number, hiringRisk: string } = { active: 0, completed: 0, jobSuccess: 0, hiringRisk: 'Low' };
  
  isLoading: boolean = true;
  error: string = '';
  isPublicView: boolean = false;

  ngOnInit() {
    this.role = this.tokenService.getRole()?.toLowerCase() || '';
    
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isPublicView = true;
        this.loadProfileData(params['id']);
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
          
          // Compute metrics
          const completed = this.diaries.filter((d: any) => d.status === 'completed' || d.status === 'closed').length;
          const active = this.diaries.filter((d: any) => d.status === 'active' || d.status === 'in progress' || d.status === 'open').length;
          const total = completed + active;
          const jobSuccess = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          let hiringRisk = 'Medium';
          if (total === 0) {
             hiringRisk = 'Medium'; // Default for new freelancers
          } else if (jobSuccess >= 85) {
             hiringRisk = 'Low';
          } else if (jobSuccess >= 60) {
             hiringRisk = 'Medium';
          } else {
             hiringRisk = 'High';
          }

          this.metrics = { active, completed, jobSuccess, hiringRisk };

          if (!id) {
            this.role = this.userData.role.toLowerCase();
          } else {
            this.role = this.userData.role.toLowerCase();
          }
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
}
