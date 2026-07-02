import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../../core/services/profile.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TalentCardComponent } from '../../../../../shared/components/talent-card/talent-card.component';
import { Category } from '../../../../../core/enums/category.enum';
import { Gender } from '../../../../../core/enums/gender.enum';
import { Availability } from '../../../../../core/enums/availability.enum';
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
  private destroyRef = inject(DestroyRef);

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



  talents = signal<any[]>([]);
  isLoading = signal(true);
  savedTalentsSet = new Set<string>();

  ngOnInit(): void {
    this.loadTalents();
  }

  loadTalents(): void {
    this.profileService.getFreelancers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        let talents = (response.items || []).map((f: any) => {
          if (f.isSaved) {
            this.savedTalentsSet.add(f._id.toString());
          }
          return this.mapTalentFields(f);
        });

        this.talents.set(talents);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading freelancers:', err);
      }
    });
  }

  applyFilters(): void {
    this.appliedSearchQuery = this.searchQuery;
    this.appliedCategory = this.selectedCategory;
    this.appliedAvailability = this.selectedAvailability;
    this.appliedGender = this.selectedGender;


    const params: any = {};

    if (this.searchQuery.trim()) {
      params.search = this.searchQuery;
    }

    if (this.selectedCategory !== 'All Categories') {
      params.category = this.selectedCategory;
    }

    if (this.selectedAvailability !== 'All Time') {
      params.availability = this.selectedAvailability;
    }

    if (this.selectedGender !== 'All Genders') {
      params.gender = this.selectedGender;
    }



    this.profileService.getFreelancers(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.success) {
          let talents = (res.items || []).map(f =>
            this.mapTalentFields(f)
          );



          this.talents.set(talents);
          this.isLoading.set(false);
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
    this.selectedAvailability = 'All Time';
    this.selectedGender = 'All Genders';


    this.appliedSearchQuery = '';
    this.appliedCategory = 'All Categories';
    this.appliedAvailability = 'All Time';
    this.appliedGender = 'All Genders';

    this.loadTalents();
  }

  isSaved(talentId: string): boolean {
    return this.savedTalentsSet.has(talentId);
  }

  toggleSaveTalent(talentId: string): void {
    if (this.savedTalentsSet.has(talentId)) {
      this.profileService.unsaveTalent(talentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          if (res.success) {
            this.savedTalentsSet.delete(talentId);
          }
        },
        error: (err) => console.error('Error unsaving talent:', err)
      });
    } else {
      this.profileService.saveTalent(talentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    return {
      id: freelancer._id,
      name: freelancer.fullName || 'Freelancer',
      role: freelancer.professionalHeadline || 'Freelancer Professional',
      location: `${freelancer.city || ''}, ${freelancer.country || ''}`
        .replace(/^,\s*/, '')
        .trim() || 'Remote',
      avatar: freelancer.profilePhoto || '/assets/images/profiles/avatar-1.jpg',

      skills: freelancer.skills || [],
      hourlyRate: freelancer.hourlyRate || 50,

      activeContracts,
      completedContracts,

      isAvailable: true,
      status: freelancer.status || 'inactive',

      stats: [
        { value: completedContracts, label: 'Completed' },
        { value: freelancer.availability?.[0] || 'N/A', label: 'Availability' },
        { value: freelancer.gender ? freelancer.gender.charAt(0).toUpperCase() + freelancer.gender.slice(1) : 'N/A', label: 'Gender' }
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

  removeAvailability(): void {
    this.selectedAvailability = 'All Time';
    this.applyFilters();
  }

  removeGender(): void {
    this.selectedGender = 'All Genders';
    this.applyFilters();
  }






}
