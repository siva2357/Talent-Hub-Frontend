import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';

@Component({
  selector: 'app-search-talent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-talent.component.html',
  styleUrl: './search-talent.component.css'
})
export class SearchTalentComponent implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  searchQuery = '';
  selectedCategory = 'All Categories';
  minRate: number | null = null;
  maxRate: number | null = null;

  talents: any[] = [];
  savedTalentsSet = new Set<string>();

  ngOnInit(): void {
    this.loadTalents();
    this.loadSavedTalents();
  }

  loadTalents(): void {
    this.profileService.getFreelancers().subscribe({
      next: (res) => {
        if (res.success && res.freelancers) {
          this.talents = res.freelancers.map((f: any) => this.mapTalentFields(f));
        }
      },
      error: (err) => console.error('Error loading freelancers:', err)
    });
  }

  loadSavedTalents(): void {
    this.profileService.getSavedTalents().subscribe({
      next: (res) => {
        if (res.success && res.savedTalents) {
          this.savedTalentsSet.clear();
          res.savedTalents.forEach((t: any) => {
            if (t._id) this.savedTalentsSet.add(t._id.toString());
          });
        }
      },
      error: (err) => console.error('Error loading saved talents:', err)
    });
  }

  applyFilters(): void {
    const params: any = {};
    if (this.searchQuery.trim()) params.search = this.searchQuery;
    if (this.selectedCategory && this.selectedCategory !== 'All Categories') {
      params.category = this.selectedCategory;
    }
    if (this.minRate !== null) params.minRate = this.minRate;
    if (this.maxRate !== null) params.maxRate = this.maxRate;

    this.profileService.getFreelancers(params).subscribe({
      next: (res) => {
        if (res.success && res.freelancers) {
          this.talents = res.freelancers.map((f: any) => this.mapTalentFields(f));
        }
      },
      error: (err) => console.error('Error filtering freelancers:', err)
    });
  }

  isSaved(talentId: string): boolean {
    return this.savedTalentsSet.has(talentId);
  }

  toggleSaveTalent(talentId: string): void {
    if (this.savedTalentsSet.has(talentId)) {
      this.profileService.unsaveTalent(talentId).subscribe({
        next: (res) => {
          if (res.success) {
            this.savedTalentsSet.delete(talentId);
          }
        },
        error: (err) => console.error('Error unsaving talent:', err)
      });
    } else {
      this.profileService.saveTalent(talentId).subscribe({
        next: (res) => {
          if (res.success) {
            this.savedTalentsSet.add(talentId);
          }
        },
        error: (err) => console.error('Error saving talent:', err)
      });
    }
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
      status: freelancer.status || 'inactive'
    };
  }
}
