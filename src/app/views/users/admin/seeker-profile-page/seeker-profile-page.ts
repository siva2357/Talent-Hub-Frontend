import { Component } from '@angular/core';
import { JobSeekerProfile } from '../../../../core/models/jobseeker-profile.model';
import { SOCIAL_ICONS, SocialPlatform } from '../../../../core/enums/socialMedia.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-seeker-profile-page',
  imports: [CommonModule],
  templateUrl: './seeker-profile-page.html',
  styleUrl: './seeker-profile-page.css',
   standalone:true
})
export class SeekerProfilePage {

  jobSeekerId: string = '';

  public jobSeekerProfile!: JobSeekerProfile;

  socialIcons = SOCIAL_ICONS;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // ✅ recruiter param
      if (id) {
        this.jobSeekerId = id;
        this.loadRecruiterProfile(id);
      }
    });
  }

  loadRecruiterProfile(id: string): void {
    this.adminService.getJobSeekerProfileById(id).subscribe({
      next: (response: any) => {
        if (response.success && response.profile) {
          this.jobSeekerProfile = response.profile;
          console.log('✅ Recruiter profile loaded:', this.jobSeekerProfile);
        }
      },
      error: (err) => {
        console.error('❌ Failed to load recruiter profile', err);
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
  this.router.navigate(['/admin/seekers-list']);
}

}
