import { Component } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin-service';
import { SOCIAL_ICONS, SocialPlatform } from '../../../../core/enums/socialMedia.enum';
import { CommonModule } from '@angular/common';
import { RecruiterProfile } from '../../../../core/models/recruiter-profile.model';

@Component({
  selector: 'app-recruiter-profile-page',
  standalone: true,
  templateUrl: './recruiter-profile-page.html',
  styleUrl: './recruiter-profile-page.css',
  imports: [CommonModule,RouterModule]
})
export class RecruiterProfilePage {

  recruiterId: string = '';

  public  recruiterProfile!: RecruiterProfile;

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
        this.recruiterId = id;
        this.loadRecruiterProfile(id);
      }
    });
  }

  loadRecruiterProfile(id: string): void {
    this.adminService.getRecruiterProfileById(id).subscribe({
      next: (response: any) => {
        if (response.success && response.profile) {
          this.recruiterProfile = response.profile;
          console.log('✅ Recruiter profile loaded:', this.recruiterProfile);
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

  get recruiterLanguages(): string {
  if (!this.recruiterProfile?.languages?.length) {
    return '—';
  }

  return this.recruiterProfile.languages
    .map((l: { language: string }) => l.language)
    .join(', ');
}


goBack(){
  this.router.navigate(['/admin/recruiters-list']);
}

}
