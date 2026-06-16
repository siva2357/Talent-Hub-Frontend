import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TalentCardComponent } from '../../../../../shared/components/talent-card/talent-card.component';
import { Category } from '../../../../../core/enums/category.enum';
import { ChipComponent } from "../../../../../shared/components/chip/chip.component";

@Component({
  selector: 'app-search-talent',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent, TalentCardComponent, ChipComponent],
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
  selectedPerformance = 'All';

categoryOptions = [
  { label: 'All Categories', value: 'All Categories' },
  ...Object.values(Category).map(category => ({
    label: category,
    value: category
  }))
];

performanceOptions = [
  { label: 'All Performance', value: 'All' },
  { label: 'New', value: 'New' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' }
];

  talents: any[] = [];
  savedTalentsSet = new Set<string>();

  ngOnInit(): void {
    this.loadTalents();
    this.loadSavedTalents();
  }

loadTalents(): void {
  this.profileService.getFreelancers().subscribe({
    next: (response) => {
      let talents = (response.items || []).map(f =>
        this.mapTalentFields(f)
      );

      if (this.selectedPerformance !== 'All') {
        talents = talents.filter(
          talent => talent.performanceTier === this.selectedPerformance
        );
      }

      this.talents = talents;
    },
    error: (err) => {
      console.error('Error loading freelancers:', err);
    }
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
  this.appliedSearchQuery = this.searchQuery;
  this.appliedCategory = this.selectedCategory;
  this.appliedPerformance = this.selectedPerformance;
  this.appliedMinRate = this.minRate;
  this.appliedMaxRate = this.maxRate;

  const params: any = {};

  if (this.searchQuery.trim()) {
    params.search = this.searchQuery;
  }

  if (this.selectedCategory !== 'All Categories') {
    params.category = this.selectedCategory;
  }

  if (this.minRate !== null) {
    params.minRate = this.minRate;
  }

  if (this.maxRate !== null) {
    params.maxRate = this.maxRate;
  }

  this.profileService.getFreelancers(params).subscribe({
    next: (res) => {
      if (res.success) {
        let talents = (res.items || []).map(f =>
          this.mapTalentFields(f)
        );

        if (this.selectedPerformance !== 'All') {
          talents = talents.filter(
            talent => talent.performanceTier === this.selectedPerformance
          );
        }

        this.talents = talents;
      }
    },
    error: (err) => {
      console.error('Error filtering freelancers:', err);
    }
  });
}

  resetFilters(): void {
  this.searchQuery = '';
  this.selectedCategory = 'All Categories';
  this.selectedPerformance = 'All';
  this.minRate = null;
  this.maxRate = null;

  this.appliedSearchQuery = '';
  this.appliedCategory = 'All Categories';
  this.appliedPerformance = 'All';
  this.appliedMinRate = null;
  this.appliedMaxRate = null;

  this.loadTalents();
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
    const activeContracts = freelancer.activeContracts || 0;
const completedContracts = freelancer.completedContracts || 0;
let performance = Math.min(100, completedContracts * 10);
let performanceTier = 'New';

if (performance > 0 && performance <= 40) {
  performanceTier = 'Low';
} else if (performance > 40 && performance <= 70) {
  performanceTier = 'Medium';
} else if (performance > 70) {
  performanceTier = 'High';
}

return {
  id: freelancer._id,
  name: freelancer.fullName || 'Freelancer',
  role: freelancer.professionalHeadline || 'Freelancer Professional',
  location: `${freelancer.city || ''}, ${freelancer.country || ''}`
    .replace(/^,\s*/, '')
    .trim() || 'Remote',
  avatar: freelancer.profilePhoto || '/assets/images/profiles/avatar-1.jpg',

  performance,
  performanceTier,

  skills: freelancer.skills || [],
  hourlyRate: freelancer.hourlyRate || 50,

  activeContracts,
  completedContracts,

  isAvailable: true,
  status: freelancer.status || 'inactive',

  stats: [
    { value: `$${freelancer.hourlyRate || 50}/hr`, label: 'Rate' },
    { value: completedContracts, label: 'Completed' },
    { value: freelancer.availability?.[0] || 'N/A',label: 'Availability'},
    { value: freelancer.gender ? freelancer.gender.charAt(0).toUpperCase() + freelancer.gender.slice(1) : 'N/A', label: 'Gender'}
  ]
};
  }


  removeSearch(): void {
  this.searchQuery = '';
  this.applyFilters();
}

removeCategory(): void {
  this.selectedCategory = 'All Categories';
  this.applyFilters();
}

removePerformance(): void {
  this.selectedPerformance = 'All';
  this.applyFilters();
}

removeMinRate(): void {
  this.minRate = null;
  this.applyFilters();
}

removeMaxRate(): void {
  this.maxRate = null;
  this.applyFilters();
}


appliedSearchQuery = '';
appliedCategory = 'All Categories';
appliedPerformance = 'All';
appliedMinRate: number | null = null;
appliedMaxRate: number | null = null;


}
