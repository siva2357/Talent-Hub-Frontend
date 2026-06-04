import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../../../core/services/profile.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-saved-talent',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
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
      dateSaved: freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'
    };
  }
}
