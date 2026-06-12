import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../../../core/services/profile.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TalentCardComponent } from '../../../../../shared/components/talent-card/talent-card.component';

@Component({
  selector: 'app-saved-talent',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TalentCardComponent],
  templateUrl: './saved-talent.component.html',
  styleUrl: './saved-talent.component.css'
})
export class SavedTalentComponent implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  savedTalents: any[] = [];

  ngOnInit(): void {
    this.loadSavedTalents();
  }

  loadSavedTalents(): void {
    this.profileService.getSavedTalents().subscribe({
      next: (res) => {
        if (res.success && res.savedTalents) {
          this.savedTalents = res.savedTalents.map((t: any) => this.mapTalentFields(t));
        }
      },
      error: (err) => console.error('Error loading saved talents:', err)
    });
  }

  unsaveTalent(talentId: string, event: Event): void {
    event.stopPropagation();
    this.profileService.unsaveTalent(talentId).subscribe({
      next: (res) => {
        if (res.success) {
          // Remove from local list
          this.savedTalents = this.savedTalents.filter(t => t.id !== talentId);
        }
      },
      error: (err) => console.error('Error unsaving talent:', err)
    });
  }

  viewProfile(talentId: string): void {
    this.router.navigate(['/user/talent-profile', talentId]);
  }

  mapTalentFields(freelancer: any): any {
    const hasContracts = (freelancer.contractCount || 0) > 0;
    const idHash = freelancer._id ? freelancer._id.toString().split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0) : 10;
    
    const rating = hasContracts ? (4.5 + (idHash % 5) / 10).toFixed(1) : '0.0';
    const projectsCount = freelancer.contractCount || 0;
    const totalHours = hasContracts ? (100 + (idHash % 10) * 150) : 0;
    
    const completedCount = freelancer.completedContractsCount || 0;
    const performance = Math.min(100, completedCount * 10);
    
    let performanceTier = 'Low';
    if (performance >= 80) {
      performanceTier = 'High';
    } else if (performance >= 40) {
      performanceTier = 'Medium';
    } else {
      performanceTier = 'Low';
    }

    return {
      id: freelancer._id,
      name: freelancer.basicInformation?.fullName || 'Freelancer',
      role: freelancer.basicInformation?.professionalHeadline || 'Freelancer Professional',
      location: freelancer.location ? `${freelancer.location.city || ''}, ${freelancer.location.country || ''}`.replace(/^,\s*/, '').trim() || 'Remote' : 'Remote',
      avatar: freelancer.basicInformation?.profilePhoto || '/assets/images/profiles/avatar-1.jpg',
      performance,
      performanceTier,
      skills: freelancer.professionalDetails?.skills || [],
      hourlyRate: freelancer.hourlyRate || 50,
      projectsCount,
      rating,
      totalHours,
      isAvailable: true,
      status: freelancer.status || 'inactive',
      dateSaved: freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
      stats: [
        { value: `$${freelancer.hourlyRate || 50}/hr`, label: 'Rate' },
        { value: projectsCount, label: 'Contracts' },
        { value: rating, label: 'Rating' },
        { value: totalHours.toLocaleString('en-US'), label: 'Hours' }
      ]
    };
  }
}
