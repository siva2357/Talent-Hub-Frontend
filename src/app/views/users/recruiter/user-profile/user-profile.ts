import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SOCIAL_ICONS, SocialPlatform } from '../../../../core/enums/socialMedia.enum';
import { RecruiterProfileService } from '../../../../core/services/recruiter-profile-service';
import { CommonModule } from '@angular/common';
import { RecruiterJobPost, RecruiterProfile, RecruiterProfileResponse } from '../../../../core/models/recruiter-profile.model';
import { StatsDataService } from '../../../../core/services/stats-data-service';
import { RecruiterStatsResponse } from '../../../../core/models/analytics.model';
@Component({
  selector: 'app-user-profile',
  imports: [RouterModule,CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  standalone: true,
})
export class UserProfile {

public recruiterProfile!: RecruiterProfile;
  recruiterJobs: RecruiterJobPost[] = [];
  recruiterStats!: RecruiterStatsResponse;
    loading = false;
  errorMessage = '';
  socialIcons = SOCIAL_ICONS;

  constructor(
    private recruiterProfileService: RecruiterProfileService,
    private router: Router,
        private statsService: StatsDataService
  ) {}

  ngOnInit(): void {
    this.loadRecruiterProfile();
    this.loadRecruiterStats();
  }



loadRecruiterStats(){
      this.loading = true;
    this.statsService.getRecruiterStats().subscribe({
      next: (res) => {
        this.recruiterStats = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
}



loadRecruiterProfile(): void {
  this.recruiterProfileService.getRecruiterProfile().subscribe({
    next: (response) => { // ✅ let TS infer the type
      if (response.success) {
        this.recruiterProfile = response.data.profile;
        this.recruiterJobs = response.data.jobs;
      }
    },
    error: (err) => {
      console.error('❌ Failed to load recruiter profile', err);
    }
  });
}




goBack(){
  this.router.navigate(['/recruiter']);
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

  get recruiterLanguages(): string {
  if (!this.recruiterProfile?.languages?.length) {
    return '—';
  }

  return this.recruiterProfile.languages
    .map((l: { language: string }) => l.language)
    .join(', ');
}

}
