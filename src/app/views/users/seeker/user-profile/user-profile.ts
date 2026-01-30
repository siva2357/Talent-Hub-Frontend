import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JobSeekerPortfolio, JobSeekerProfile } from '../../../../core/models/jobseeker-profile.model';
import { SOCIAL_ICONS, SocialPlatform } from '../../../../core/enums/socialMedia.enum';
import { SeekerProfileService } from '../../../../core/services/seeker-profile-service';
import { CommonModule } from '@angular/common';
import { StatsDataService } from '../../../../core/services/stats-data-service';
import { JobSeekerStatsResponse } from '../../../../core/models/analytics.model';
@Component({
  selector: 'app-user-profile',
  imports: [RouterModule,CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
    standalone: true,
})
export class UserProfile {
public jobSeekerProfile: JobSeekerProfile | null = null;
portfolios: JobSeekerPortfolio[] = [];
trackPortfolio = (_: number, item: JobSeekerPortfolio) =>
  item.createdAt;

  socialIcons = SOCIAL_ICONS;
  jobSeekerStats!: JobSeekerStatsResponse;
    loading = false;
  errorMessage = '';

  constructor(
    private jobSeekerProfileService: SeekerProfileService,
    private router: Router,
    private statsService: StatsDataService
  ) {}



  ngOnInit(): void {
     this.loadJobSeekerProfile()
     this.loadJobSeekerStats()
  }

loadJobSeekerStats(){
      this.loading = true;
    this.statsService.getJobSeekerStats().subscribe({
      next: (res) => {
        this.jobSeekerStats = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
}

  loadJobSeekerProfile(): void {
    this.jobSeekerProfileService.getJobSeekerProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.jobSeekerProfile = response.data.profile;
          this.portfolios = response.data.portfolios || []; // ✅ FIXED

          console.log('Profile:', this.jobSeekerProfile);
          console.log('Portfolios:', this.portfolios);
        }
      },
      error: (err) => {
        console.error('❌ Failed to load job seeker profile', err);
      }
    });
  }



goBack(){
  this.router.navigate(['/jobSeeker']);
}

  getSocialIcon(platform: string): string {
    const normalized = Object.keys(SocialPlatform).find(
      key =>
        SocialPlatform[key as keyof typeof SocialPlatform]
          .toLowerCase() === platform.toLowerCase()
    );

    return normalized
      ? this.socialIcons[SocialPlatform[normalized as keyof typeof SocialPlatform]]
      : 'bi bi-globe';
  }

  get jobSeekerLanguages(): string {
  if (!this.jobSeekerProfile?.languages?.length) {
    return '—';
  }

  return this.jobSeekerProfile.languages
    .map((l: { language: string }) => l.language)
    .join(', ');
}
}
