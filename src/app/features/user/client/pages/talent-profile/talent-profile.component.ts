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
        if (res.success && res.profile) {
          this.talent = this.mapProfileFields(res.profile);
        } else {
          this.router.navigate(['/user/search-talent']);
        }
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

  mapProfileFields(freelancer: any): any {
    const hasContracts = freelancer.contractCount > 0;
    const idHash = freelancer._id ? freelancer._id.toString().split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0) : 10;
    
    const rating = hasContracts ? (4.5 + (idHash % 5) / 10).toFixed(1) : '0.0';
    const projectsCount = hasContracts ? (10 + (idHash % 40)) : 0;
    const totalHours = hasContracts ? (100 + (idHash % 10) * 150) : 0;
    const performance = hasContracts ? (50 + (idHash % 51)) : 0;
    
    let performanceTier = 'New';
    if (hasContracts) {
      if (performance >= 75) {
        performanceTier = 'High';
      } else if (performance < 55) {
        performanceTier = 'Low';
      } else {
        performanceTier = 'Medium';
      }
    }

    const mockContractHistory = hasContracts ? [
      {
        role: 'Enterprise Dashboard Redesign',
        company: 'TechNova Inc.',
        amount: '$12,500',
        duration: 'Jan 2024 - Mar 2024',
        rating: 5.0,
        icon: 'bi-window-stack',
        color: 'bg-primary'
      },
      {
        role: 'Mobile App UX Audit',
        company: 'PixelCraft Studio',
        amount: '$4,200',
        duration: 'Dec 2023 - Jan 2024',
        rating: 4.9,
        icon: 'bi-phone-vibrate',
        color: 'bg-purple'
      },
      {
        role: 'E-commerce Brand Identity',
        company: 'DesignHub',
        amount: '$8,000',
        duration: 'Oct 2023 - Nov 2023',
        rating: 5.0,
        icon: 'bi-bag-check',
        color: 'bg-success'
      }
    ] : [];

    const mockPortfolio = [
      { id: '1', title: 'FinTech App Design', category: 'Mobile App', role: 'Lead Designer', tags: ['Figma', 'UI/UX', 'Mobile'], media: [{ mediaType: 'image', url: '/assets/images/Talent profile.png' }], description: 'A complete FinTech application design emphasizing clean user flows and accessibility.', performance: '98% Client Satisfaction' },
      { id: '2', title: 'SaaS Analytics Dashboard', category: 'Web App', role: 'Fullstack Developer', tags: ['React', 'D3.js', 'Node.js'], media: [{ mediaType: 'image', url: '/assets/images/dashboard.png' }], description: 'Interactive dashboard showing complex metrics with high-performance charts.', performance: 'Reduced churn by 15%' },
      { id: '3', title: 'E-learning Platform', category: 'EdTech', role: 'Frontend Lead', tags: ['Angular', 'TypeScript', 'SCSS'], media: [{ mediaType: 'image', url: '/assets/images/workspace.png' }], description: 'An educational hub serving thousands of active monthly users with real-time course progress.', performance: '4.9/5 Average Rating' }
    ];

    const realPortfolio = (freelancer.professionalDetails?.portfolio && freelancer.professionalDetails.portfolio.length > 0)
      ? freelancer.professionalDetails.portfolio.map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          description: item.description || '',
          role: item.role || '',
          category: item.projectType || 'Project',
          tags: item.tags || item.technologies || [],
          media: item.media && item.media.length > 0 ? item.media : (item.imageUrl ? [{ mediaType: 'image', url: item.imageUrl }] : []),
          projectUrl: item.projectUrl || '',
          performance: 'Verified Deliverable'
        }))
      : mockPortfolio;

    const mockSocialLinks = freelancer.socialLinks && freelancer.socialLinks.length > 0 
      ? freelancer.socialLinks.map((s: any) => ({
          name: s.platform,
          icon: `bi-${s.platform.toLowerCase()}`,
          url: s.profileUrl || '#',
          handle: s.profileUrl ? `@${s.profileUrl.split('/').pop()}` : `@${freelancer.basicInformation?.username || 'freelancer'}`
        }))
      : [
          { name: 'LinkedIn', icon: 'bi-linkedin', url: '#', handle: `@${freelancer.basicInformation?.username || 'freelancer'}` },
          { name: 'Behance', icon: 'bi-behance', url: '#', handle: `${freelancer.basicInformation?.username || 'freelancer'}_ux` },
          { name: 'Dribbble', icon: 'bi-dribbble', url: '#', handle: `${freelancer.basicInformation?.username || 'freelancer'}j_design` },
          { name: 'Twitter', icon: 'bi-twitter-x', url: '#', handle: `@${freelancer.basicInformation?.username || 'freelancer'}_designs` }
        ];

    const mockLanguages = freelancer.languages && freelancer.languages.length > 0
      ? freelancer.languages.map((l: any) => ({ name: l.language, level: l.proficiency }))
      : [
          { name: 'English', level: 'Native' },
          { name: 'Spanish', level: 'Conversational' }
        ];

    const availabilityDays = freelancer.availability || [];
    const availabilityText = availabilityDays.length > 0 ? `Available (${availabilityDays.join(', ')})` : 'Available';
    const weeklyHoursText = availabilityDays.length > 0 ? `${availabilityDays.length * 8} hrs/week` : '40 hrs/week';

    return {
      name: freelancer.basicInformation?.fullName || 'Freelancer',
      title: freelancer.basicInformation?.professionalHeadline || 'Freelancer Professional',
      location: freelancer.location ? `${freelancer.location.city || ''}, ${freelancer.location.country || ''}`.replace(/^,\s*/, '').trim() || 'Remote' : 'Remote',
      avatar: freelancer.basicInformation?.profilePhoto || '/assets/images/profiles/avatar-1.jpg',
      coverImage: '/assets/images/workspace.png',
      performance,
      performanceTier,
      rating,
      projects: projectsCount,
      hourlyRate: freelancer.hourlyRate || 50,
      hoursWorked: totalHours.toLocaleString(),
      experience: '3+ Years',
      jobSuccess: '100%',
      bio: freelancer.basicInformation?.shortBio || 'This freelancer has not written a biography yet.',
      skills: freelancer.professionalDetails?.skills || [],
      contractHistory: mockContractHistory,
      portfolio: realPortfolio,
      socialMedia: mockSocialLinks,
      availability: availabilityText,
      weeklyHours: weeklyHoursText,
      languages: mockLanguages
    };
  }
}
