import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JobSeekerProfile } from '../../../../core/models/jobseeker-profile.model';
import { SOCIAL_ICONS, SocialPlatform } from '../../../../core/enums/socialMedia.enum';
import { SeekerProfileService } from '../../../../core/services/seeker-profile-service';
import { CommonModule } from '@angular/common';
import { Projects } from '../../../../core/models/portfolio.model';
@Component({
  selector: 'app-user-profile',
  imports: [RouterModule,CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
    standalone: true,
})
export class UserProfile {
public jobSeekerProfile: JobSeekerProfile | null = null;
portfolios: Projects[] = []; // ✅ ADD THIS

  socialIcons = SOCIAL_ICONS;

  constructor(
    private jobSeekerProfileService: SeekerProfileService,
    private router: Router
  ) {}



  ngOnInit(): void {
     this.loadJobSeekerProfile()
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
