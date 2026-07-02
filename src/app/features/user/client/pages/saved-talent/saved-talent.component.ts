import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TalentCardComponent } from '../../../../../shared/components/talent-card/talent-card.component';
import { ChipComponent } from "../../../../../shared/components/chip/chip.component";
import { Category } from '../../../../../core/enums/category.enum';
import { Gender } from '../../../../../core/enums/gender.enum';
import { Availability } from '../../../../../core/enums/availability.enum';

@Component({
  selector: 'app-saved-talent',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, InputComponent, ButtonComponent, TalentCardComponent, ChipComponent],
  templateUrl: './saved-talent.component.html',
  styleUrl: './saved-talent.component.css'
})
export class SavedTalentComponent implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  allSavedTalents: any[] = [];
  savedTalents = signal<any[]>([]);

  searchQuery = '';
  selectedCategory = 'All Categories';
  selectedAvailability = 'All Time';
  selectedGender = 'All Genders';

  appliedSearchQuery = '';
  appliedCategory = 'All Categories';
  appliedGender = "All Genders";
  appliedAvailability = "All Time";

  categoryOptions = [
    { label: 'All Categories', value: 'All Categories' },
    ...Object.values(Category).map(category => ({
      label: category,
      value: category
    }))
  ];

  availabilityOptions = [
    { label: 'All Time', value: 'All Time' },
    ...Object.values(Availability).map(availability => ({
      label: availability,
      value: availability
    }))
  ];

  genderOptions = [
    { label: 'All Genders', value: 'All Genders' },
    ...Object.values(Gender).map(gender => ({
      label: gender,
      value: gender
    }))
  ];

  ngOnInit(): void {
    this.loadSavedTalents();
  }

  loadSavedTalents(): void {
    this.profileService.getSavedTalents().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.success && res.items) {
          this.allSavedTalents = res.items.map((t: any) => this.mapTalentFields(t));
          this.applyFilters();
        }
      },
      error: (err) => console.error('Error loading saved talents:', err)
    });
  }

  applyFilters(): void {
    this.appliedSearchQuery = this.searchQuery;
    this.appliedCategory = this.selectedCategory;
    this.appliedAvailability = this.selectedAvailability;
    this.appliedGender = this.selectedGender;

    let filtered = this.allSavedTalents;

    if (this.appliedSearchQuery.trim()) {
      const q = this.appliedSearchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.role.toLowerCase().includes(q) || 
        t.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    if (this.appliedCategory !== 'All Categories') {
      filtered = filtered.filter(t => t.categories?.includes(this.appliedCategory));
    }

    if (this.appliedAvailability !== 'All Time') {
      filtered = filtered.filter(t => t.availabilityRaw?.includes(this.appliedAvailability));
    }

    if (this.appliedGender !== 'All Genders') {
      filtered = filtered.filter(t => t.genderRaw?.toLowerCase() === this.appliedGender.toLowerCase());
    }

    this.savedTalents.set(filtered);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All Categories';
    this.selectedAvailability = 'All Time';
    this.selectedGender = 'All Genders';

    this.applyFilters();
  }

  removeSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  removeCategory(): void {
    this.selectedCategory = 'All Categories';
    this.applyFilters();
  }

  removeAvailability(): void {
    this.selectedAvailability = 'All Time';
    this.applyFilters();
  }

  removeGender(): void {
    this.selectedGender = 'All Genders';
    this.applyFilters();
  }

  unsaveTalent(talentId: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.profileService.unsaveTalent(talentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.success) {
          this.allSavedTalents = this.allSavedTalents.filter(t => t.id !== talentId);
          this.applyFilters();
        }
      },
      error: (err) => console.error('Error unsaving talent:', err)
    });
  }

  viewProfile(talentId: string): void {
    this.router.navigate(['/user/talent-profile', talentId]);
  }

  mapTalentFields(freelancer: any): any {
    const activeContracts = freelancer.activeContracts || 0;
    const completedContracts = freelancer.completedContracts || 0;

    return {
      id: freelancer._id,
      name: freelancer.fullName || 'Freelancer',
      role: freelancer.professionalHeadline || 'Freelancer Professional',
      location: `${freelancer.city || ''}, ${freelancer.country || ''}`
        .replace(/^,\s*/, '')
        .trim() || 'Remote',
      avatar: freelancer.profilePhoto || '/assets/images/profiles/avatar-1.jpg',

      skills: freelancer.skills || [],
      categories: freelancer.categories || [],
      availabilityRaw: freelancer.availability || [],
      genderRaw: freelancer.gender || '',

      activeContracts,
      completedContracts,

      isAvailable: true,
      status: freelancer.status || 'inactive',
      dateSaved: freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',

      stats: [
        { value: completedContracts, label: 'Completed' },
        { value: freelancer.availability?.[0] || 'N/A', label: 'Availability' },
        { value: freelancer.gender ? freelancer.gender.charAt(0).toUpperCase() + freelancer.gender.slice(1) : 'N/A', label: 'Gender' }
      ]
    };
  }
}
