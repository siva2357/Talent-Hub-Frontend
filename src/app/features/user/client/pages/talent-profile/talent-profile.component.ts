import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ProfileService } from '../../../../../core/services/profile.service';
import { TalentProfile } from '../../../../../core/model/talents.model';

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

      const payload = res.data;

      if (!payload?.success || !payload.profile) {
        this.router.navigate(['/user/search-talent']);
        return;
      }

      this.talent = this.mapProfileFields(
        payload.profile,
        payload.portfolio || []
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
  freelancer: TalentProfile,
  portfolio: any[]
): any {

  const socialLinks = (freelancer.socialLinks || []).map(s => ({
    name: s.platform.charAt(0).toUpperCase() + s.platform.slice(1),
    icon: `bi-${s.platform.toLowerCase()}`,
    url: s.profileUrl,
    handle: s.profileUrl
  }));

  const languages = (freelancer.languages || []).map(l => ({
    name: l.language,
    level: l.proficiency
  }));

  const availability =
    freelancer.availability?.length
      ? freelancer.availability.join(', ')
      : 'Not Available';

  const realPortfolio = (portfolio || []).map((item: any) => ({
    id: item._id,
    title: item.title,
    description: item.description || '',
    role: item.role || '',
    category: item.projectType || '',
    tags: item.tags || [],
    media: item.media || [],
    projectUrl: item.projectUrl || ''
  }));

const performance =
  freelancer.completedContracts > 0
    ? Math.min(
        100,
        Math.round(
          (freelancer.completedContracts /
            (freelancer.completedContracts + freelancer.activeContracts)
          ) * 100
        )
      )
    : 0;

let performanceTier = 'New Freelancer';

if (performance >= 75) {
  performanceTier = 'High';
} else if (performance >= 50) {
  performanceTier = 'Medium';
} else if (performance > 0) {
  performanceTier = 'Low';
}
  return {
    name: freelancer.fullName || '',

    title: freelancer.professionalHeadline || '',

    location: `${freelancer.city || ''}, ${freelancer.country || ''}`
      .replace(/^,\s*/, '')
      .trim(),

    avatar: freelancer.profilePhoto || '',

    coverImage: freelancer.profilePhoto || '',

    bio: freelancer.shortBio || '',

    skills: freelancer.skills || [],

    hourlyRate: freelancer.hourlyRate || 0,

    availability,

    languages,

    socialMedia: socialLinks,

    portfolio: realPortfolio,

     activeContracts: freelancer.activeContracts || 0,
  completedContracts: freelancer.completedContracts || 0,
  gender: freelancer.gender
    ? freelancer.gender.charAt(0).toUpperCase() + freelancer.gender.slice(1)
    : 'N/A',

    status: freelancer.status || 'inactive',

    contractHistory: [],

    performance,

    performanceTier,

    rating:
      freelancer.completedContracts > 0
        ? 'Available'
        : 'N/A',

    hoursWorked: 'N/A',

    experience:
      freelancer.activeContracts > 0
        ? `${freelancer.activeContracts} Contracts`
        : 'New Freelancer',

    jobSuccess:
      freelancer.completedContracts > 0
        ? `${freelancer.completedContracts} Completed`
        : 'N/A'
  };
}
}
