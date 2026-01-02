import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { UserService } from '../../../../core/services/user-service';
import { Router, RouterModule } from '@angular/router';
import { Talent } from '../../../../core/models/talent.model';
import { CommonModule } from '@angular/common';
import { LOCATIONS } from '../../../../core/enums/location.enum';
import { SECTOR } from '../../../../core/enums/sector.enum';
import { FormsModule } from '@angular/forms';
import { SKILLS } from '../../../../core/enums/skills.enum';

@Component({
  selector: 'app-talents',
  templateUrl: './talents.html',
  styleUrl: './talents.css',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule]
})
export class Talents implements OnInit {

  talents: Talent[] = [];
  savedTalentIds: string[] = [];
  errorMessage = '';
  filteredTalents: Talent[] = [];

    // 🔹 FILTER STATE
  selectedLocation = '';
  selectedSector = '';
selectedSkills: string[] = [];

  // 🔹 ENUM VALUES FOR TEMPLATE
  LOCATIONS = Object.values(LOCATIONS);
  SECTORS = Object.values(SECTOR);
  SKILLS = Object.values(SKILLS);

skillsOpen = false;


  constructor(
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadSavedTalents();
  }

  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  if (!this.elementRef.nativeElement.contains(event.target)) {
    this.skillsOpen = false;
  }
}


  /* ================= LOAD SAVED TALENTS FIRST ================= */
  private loadSavedTalents(): void {
    this.userService.getSavedTalents().subscribe({
      next: (response) => {
        this.savedTalentIds = response.data.map(t => t.userId);
        this.fetchTalents();
      },
      error: () => {
        // even if this fails, still load talents
        this.fetchTalents();
      }
    });
  }

  /* ================= LOAD ALL TALENTS ================= */
fetchTalents(): void {
  this.userService.getAllTalents().subscribe({
    next: (response) => {
      this.talents = (response.data || []).map(talent => ({
        ...talent,
        saved: this.savedTalentIds.includes(talent.userId)
      }));

      // ✅ THIS WAS MISSING
      this.applyFilters();
    },
    error: (error) => {
      console.error('Error fetching talents:', error);
      this.errorMessage = 'Failed to load talents.';
    }
  });
}

toggleSkill(skill: string): void {
  if (this.selectedSkills.includes(skill)) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  } else {
    this.selectedSkills = [...this.selectedSkills, skill];
  }

  this.applyFilters();
}


    /* ================= FILTER LOGIC ================= */
applyFilters(): void {
  this.filteredTalents = this.talents.filter(talent => {

    const matchLocation =
      !this.selectedLocation || talent.location === this.selectedLocation;

    const matchSector =
      !this.selectedSector || talent.sector === this.selectedSector;

    const matchSkill =
      this.selectedSkills.length === 0 ||
      this.selectedSkills.some(skill =>
        talent.skills?.includes(skill)
      );

    return matchLocation && matchSector && matchSkill;
  });
}

removeSkill(skill: string): void {
  this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  this.applyFilters();
}


clearLocation(): void {
  this.selectedLocation = '';
  this.applyFilters();
}

clearSector(): void {
  this.selectedSector = '';
  this.applyFilters();
}

clearAllSkills(): void {
  this.selectedSkills = [];
  this.applyFilters();
}

  /* ================= SAVE / UNSAVE ================= */

  saveTalent(talent: Talent): void {
    this.userService.saveTalent(talent.userId).subscribe({
      next: () => {
        talent.saved = true;
        this.savedTalentIds.push(talent.userId);
      }
    });
  }

  unsaveTalent(talent: Talent): void {
    this.userService.unsaveTalent(talent.userId).subscribe({
      next: () => {
        talent.saved = false;
        this.savedTalentIds =
          this.savedTalentIds.filter(id => id !== talent.userId);
      }
    });
  }

  /* ================= NAVIGATION ================= */

  viewProfile(talent: Talent): void {
    this.router.navigate([
      '/recruiter/talents',
      talent.userId,
      'profile'
    ]);
  }

  messageTalent(talent: Talent): void {
    // empty for now
  }
}
