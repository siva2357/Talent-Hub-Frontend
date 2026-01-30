import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SOCIAL_ICONS, SocialPlatform } from
  '../../../../core/enums/socialMedia.enum';
import { RecruiterProfileService } from
  '../../../../core/services/recruiter-profile-service';

import { StatsDataService } from
  '../../../../core/services/stats-data-service';
import { RecruiterStatsResponse } from
  '../../../../core/models/analytics.model';
import { RecruiterJobSummary, RecruiterProfile } from '../../../../core/models/recruiter-profile.model';

@Component({
  selector: 'app-user-profile',
  imports: [RouterModule, CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
  standalone: true,
})
export class UserProfile {

  recruiterProfile!: RecruiterProfile;
  recruiterJobs: RecruiterJobSummary[] = [];
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

  loadRecruiterProfile(): void {
    this.recruiterProfileService.getRecruiterProfile().subscribe({
      next: (response) => {
        if (!response.success) return;

        this.recruiterProfile = response.data.profile;
        this.recruiterJobs = response.data.jobs;
      },
      error: (err) => {
        console.error('❌ Failed to load recruiter profile', err);
      }
    });
  }

  loadRecruiterStats(): void {
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

  goBack(): void {
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
    if (!this.recruiterProfile?.languages?.length) return '—';

    return this.recruiterProfile.languages
      .map(l => l.language)
      .join(', ');
  }
}
