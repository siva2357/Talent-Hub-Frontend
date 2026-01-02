import { Component } from '@angular/core';
import { JobSeekerProfile } from '../../../../core/models/jobseeker-profile.model';
import { SOCIAL_ICONS, SocialPlatform } from '../../../../core/enums/socialMedia.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Projects } from '../../../../core/models/portfolio.model';
import { UserService } from '../../../../core/services/user-service';

@Component({
  selector: 'app-talent-profile-page',
  imports: [CommonModule],
  templateUrl: './talent-profile-page.html',
  styleUrl: './talent-profile-page.css',
  standalone:true
})
export class TalentProfilePage {

  jobSeekerId: string = '';

  public jobSeekerProfile!: JobSeekerProfile;
portfolios: Projects[] = []; // ✅ ADD THIS
  socialIcons = SOCIAL_ICONS;

  constructor(
    private route: ActivatedRoute,
     private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // ✅ recruiter param
      if (id) {
        this.jobSeekerId = id;
        this.loadTalentProfile(id);
      }
    });
  }

loadTalentProfile(id: string): void {
  this.userService.getTalentProfileById(id).subscribe({
    next: (response: any) => {
      if (response.success && response.data) {

        // ✅ FIXED MAPPING
        this.jobSeekerProfile = response.data.profileDetails;
        this.portfolios = response.data.portfolio || [];

        console.log('Profile:', this.jobSeekerProfile);
        console.log('Portfolios:', this.portfolios);
      }
    },
    error: (err) => {
      console.error('❌ Failed to load talent profile', err);
    }
  });
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


goBack(){
  this.router.navigate(['/recruiter/talents']);
}
}
