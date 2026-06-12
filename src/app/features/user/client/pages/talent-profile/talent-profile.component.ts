import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ProfileService } from '../../../../../core/services/profile.service';

@Component({
  selector: 'app-talent-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './talent-profile.component.html',
  styleUrl: './talent-profile.component.css'
})
export class TalentProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);

  talentId = '';
  isSavedTalent = false;
  talent: any = null;
  selectedPortfolioItem: any = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.talentId = id;
        this.loadProfile(id);
        this.checkSavedStatus(id);
      } else {
        // Fallback or navigate away
        this.router.navigate(['/user/search-talent']);
      }
    });
  }

  openPortfolioDetail(item: any): void {
    this.selectedPortfolioItem = item;
  }

  closePortfolioDetail(): void {
    this.selectedPortfolioItem = null;
  }

loadProfile(id: string): void {
  this.profileService.getFreelancerProfileById(id).subscribe({
    next: (res) => {

      if (!res.success || !res.profile) {
        this.router.navigate(['/user/search-talent']);
        return;
      }

      this.talent = this.mapProfileFields(
        res.profile,
        res.portfolio || []
      );

    },
    error: (err) => {
      console.error('Error loading freelancer profile:', err);
      this.router.navigate(['/user/search-talent']);
    }
  });
}

  checkSavedStatus(id: string): void {
    this.profileService.getSavedTalents().subscribe({
      next: (res) => {
        if (res.success && res.savedTalents) {
          this.isSavedTalent = res.savedTalents.some((t: any) => t._id === id);
        }
      },
      error: (err) => console.error('Error checking saved status:', err)
    });
  }

  toggleSaveTalent(): void {
    if (!this.talentId) return;

    if (this.isSavedTalent) {
      this.profileService.unsaveTalent(this.talentId).subscribe({
        next: (res) => {
          if (res.success) {
            this.isSavedTalent = false;
          }
        },
        error: (err) => console.error('Error unsaving talent:', err)
      });
    } else {
      this.profileService.saveTalent(this.talentId).subscribe({
        next: (res) => {
          if (res.success) {
            this.isSavedTalent = true;
          }
        },
        error: (err) => console.error('Error saving talent:', err)
      });
    }
  }

mapProfileFields(
  freelancer: any,
  portfolio: any[]
): any {

  const socialLinks =
    freelancer.socialLinks?.map((s: any) => ({
      name: s.platform,
      icon: `bi-${s.platform.toLowerCase()}`,
      url: s.profileUrl,
      handle: s.profileUrl
    })) || [];

  const languages =
    freelancer.languages?.map((l: any) => ({
      name: l.language,
      level: l.proficiency
    })) || [];

  const availability =
    freelancer.availability?.length
      ? freelancer.availability.join(', ')
      : 'Not Available';

  const realPortfolio = portfolio.map((item: any) => ({
    id: item._id,
    title: item.title,
    description: item.description || '',
    role: item.role || '',
    category: item.projectType || '',
    tags: item.tags || [],
    media: item.media || [],
    projectUrl: item.projectUrl || ''
  }));

  return {

    name:
      freelancer.basicInformation?.fullName || '',

    title:
      freelancer.basicInformation?.professionalHeadline || '',

    location:
      `${freelancer.location?.city || ''}, ${freelancer.location?.country || ''}`
        .replace(/^,\s*/, '')
        .trim(),

    avatar:
      freelancer.basicInformation?.profilePhoto || '',

    coverImage:
      freelancer.basicInformation?.profilePhoto || '',

    bio:
      freelancer.basicInformation?.shortBio || '',

    skills:
      freelancer.professionalDetails?.skills || [],

    hourlyRate:
      freelancer.hourlyRate || 0,

    availability,

    languages,

    socialMedia: socialLinks,

    portfolio: realPortfolio,

    projects:
      freelancer.contractCount || 0,

    completedContracts:
      freelancer.completedContractsCount || 0,

    status:
      freelancer.status || 'inactive',

    contractHistory: [],

    performance: 0,

    performanceTier:
      freelancer.contractCount > 0
        ? 'Active'
        : 'New',

    rating:
      freelancer.contractCount > 0
        ? 'Available'
        : 'N/A',

    hoursWorked: 'N/A',

    experience:
      freelancer.contractCount > 0
        ? `${freelancer.contractCount} Contracts`
        : 'New Freelancer',

    jobSuccess:
      freelancer.completedContractsCount > 0
        ? `${freelancer.completedContractsCount} Completed`
        : 'N/A'
  };
}
}
