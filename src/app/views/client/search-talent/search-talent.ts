import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { AIService } from '../../../core/services/ai.service';
import { TalentCard } from '../../../library/shared/components/talent-card/talent-card';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-search-talent',
  standalone: true,
  imports: [CommonModule, FormsModule, TalentCard, InputField, Chip, Button],
  templateUrl: './search-talent.html',
  styleUrl: './search-talent.css'
})
export class SearchTalent implements OnInit {
  rawFreelancers: any[] = [];
  freelancers: any[] = [];
  isLoading = false;
  
  // UI State
  showAIFilter = false;
  
  // AI Matching properties
  isAIMatching = false;
  isAIApplied = false;
  searchCategory = '';
  searchSkillInput = '';
  searchSkills: string[] = [];

  // Manual Filter Options
  skillOptions: InputOption[] = [
    { label: 'All Skills', value: 'all' },
    { label: 'Angular', value: 'Angular' },
    { label: 'React', value: 'React' },
    { label: 'Node.js', value: 'Node.js' }
  ];
  experienceOptions: InputOption[] = [
    { label: 'All Levels', value: 'all' },
    { label: 'Entry', value: 'Entry' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Expert', value: 'Expert' }
  ];
  availabilityOptions: InputOption[] = [
    { label: 'All Availability', value: 'all' },
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' }
  ];
  rateOptions: InputOption[] = [
    { label: 'All Rates', value: 'all' },
    { label: 'Below $20/hr', value: 'low' },
    { label: '$20 - $50/hr', value: 'medium' },
    { label: 'Above $50/hr', value: 'high' }
  ];
  locationOptions: InputOption[] = [
    { label: 'All Locations', value: 'all' },
    { label: 'Remote', value: 'Remote' },
    { label: 'On-site', value: 'On-site' }
  ];
  languageOptions: InputOption[] = [
    { label: 'All Languages', value: 'all' },
    { label: 'English', value: 'English' }
  ];
  successOptions: InputOption[] = [
    { label: 'All Ratings', value: 'all' },
    { label: 'Top Rated', value: 'top' },
    { label: 'Rising Talent', value: 'rising' }
  ];
  sortOptions: InputOption[] = [
    { label: 'Best Match', value: 'best_match' },
    { label: 'Newest', value: 'newest' }
  ];

  // Manual Filter state
  selectedSkill = 'all';
  selectedExperience = 'all';
  selectedAvailability = 'all';
  selectedRate = 'all';
  selectedLocation = 'all';
  selectedLanguage = 'all';
  selectedSuccess = 'all';
  selectedSort = 'best_match';

  activeManualFilters: { label: string, type: string, value: string }[] = [];

  categoryOptions: InputOption[] = [
    { label: 'Select a category...', value: '' },
    { label: 'Frontend Developer', value: 'Frontend Developer' },
    { label: 'Backend Developer', value: 'Backend Developer' },
    { label: 'Fullstack Developer', value: 'Fullstack Developer' },
    { label: 'UI/UX Designer', value: 'UI/UX Designer' },
    { label: 'DevOps Engineer', value: 'DevOps Engineer' }
  ];

  constructor(
    private profileService: ProfileService,
    private aiService: AIService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFreelancers();
  }

  toggleAIFilter(): void {
    this.showAIFilter = !this.showAIFilter;
  }

  fetchFreelancers(): void {
    this.isLoading = true;
    this.profileService.getAllFreelancers().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && (res.items || res.data)) {
          this.rawFreelancers = res.items || res.data;
          this.freelancers = [...this.rawFreelancers];
          this.applyManualFilters();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching freelancers', err);
      }
    });
  }

  // --- Manual Filters ---

  applyManualFilters(): void {
    if (this.showAIFilter && this.isAIApplied) {
      return; // Skip manual filtering if AI match is active
    }

    this.activeManualFilters = [];

    let filtered = [...this.rawFreelancers];

    if (this.selectedSkill !== 'all') {
      const q = this.selectedSkill.toLowerCase();
      this.activeManualFilters.push({ label: `Skill: ${this.selectedSkill}`, type: 'skill', value: this.selectedSkill });
      filtered = filtered.filter(f => 
        (f.skills && Array.isArray(f.skills) && f.skills.some((s: string) => s.toLowerCase() === q)) ||
        (f.professionalHeadline && f.professionalHeadline.toLowerCase().includes(q))
      );
    }

    if (this.selectedExperience !== 'all') {
      const q = this.selectedExperience.toLowerCase();
      this.activeManualFilters.push({ label: `Experience: ${this.selectedExperience}`, type: 'experience', value: this.selectedExperience });
      filtered = filtered.filter(f => f.experienceLevel?.toLowerCase() === q);
    }

    if (this.selectedAvailability !== 'all') {
      const q = this.selectedAvailability.toLowerCase();
      this.activeManualFilters.push({ label: `Availability: ${this.selectedAvailability}`, type: 'availability', value: this.selectedAvailability });
      filtered = filtered.filter(f => {
        if (Array.isArray(f.availability)) {
          return f.availability.some((a: string) => a.toLowerCase().includes(q));
        }
        return f.availability?.toLowerCase().includes(q);
      });
    }
    
    if (this.selectedRate !== 'all') {
      const rateLabel = this.rateOptions.find(o => o.value === this.selectedRate)?.label || this.selectedRate;
      this.activeManualFilters.push({ label: `Rate: ${rateLabel}`, type: 'rate', value: this.selectedRate });
    }
    if (this.selectedLocation !== 'all') {
      this.activeManualFilters.push({ label: `Location: ${this.selectedLocation}`, type: 'location', value: this.selectedLocation });
    }
    if (this.selectedLanguage !== 'all') {
      this.activeManualFilters.push({ label: `Language: ${this.selectedLanguage}`, type: 'language', value: this.selectedLanguage });
    }
    if (this.selectedSuccess !== 'all') {
      const successLabel = this.successOptions.find(o => o.value === this.selectedSuccess)?.label || this.selectedSuccess;
      this.activeManualFilters.push({ label: `Success: ${successLabel}`, type: 'success', value: this.selectedSuccess });
    }

    // Sort by best match could just leave as is for now, or sort by id etc.
    if (this.selectedSort === 'newest') {
      filtered.reverse(); // Mock reverse
    }

    this.freelancers = filtered;
  }

  resetManualFilters(): void {
    this.selectedSkill = 'all';
    this.selectedExperience = 'all';
    this.selectedAvailability = 'all';
    this.selectedRate = 'all';
    this.selectedLocation = 'all';
    this.selectedLanguage = 'all';
    this.selectedSuccess = 'all';
    this.selectedSort = 'best_match';
    this.applyManualFilters();
  }

  removeManualFilter(filterToRemove: { label: string, type: string, value: string }): void {
    if (filterToRemove.type === 'skill') this.selectedSkill = 'all';
    else if (filterToRemove.type === 'experience') this.selectedExperience = 'all';
    else if (filterToRemove.type === 'availability') this.selectedAvailability = 'all';
    else if (filterToRemove.type === 'rate') this.selectedRate = 'all';
    else if (filterToRemove.type === 'location') this.selectedLocation = 'all';
    else if (filterToRemove.type === 'language') this.selectedLanguage = 'all';
    else if (filterToRemove.type === 'success') this.selectedSuccess = 'all';
    
    this.applyManualFilters();
  }

  // --- AI Filters ---

  addSkill(): void {
    const skill = this.searchSkillInput.trim();
    if (skill && !this.searchSkills.includes(skill)) {
      this.searchSkills.push(skill);
    }
    this.searchSkillInput = '';
  }

  removeSkill(skill: string): void {
    this.searchSkills = this.searchSkills.filter(s => s !== skill);
  }

  matchWithAI(): void {
    if (!this.searchCategory || this.freelancers.length === 0) return;
    
    this.isAIMatching = true;
    
    this.aiService.matchTalent(this.searchCategory, this.searchSkills, this.rawFreelancers).subscribe({
      next: (res) => {
        if (res && res.matches) {
          const matchResults = Array.isArray(res.matches) ? res.matches : (res.matches.results || []);
          
          const mappedFreelancers = this.rawFreelancers.map(freelancer => {
            const match = matchResults.find((m: any) => m.candidate_id === freelancer.userId || m.candidate_id === freelancer._id);
            if (match) {
              return {
                ...freelancer,
                matchPercentage: match.match_percentage,
                matchCategory: match.match_category,
                matchReasoning: match.reasoning
              };
            }
            return freelancer;
          });
          
          mappedFreelancers.sort((a, b) => {
            const scoreA = a.matchPercentage !== undefined ? a.matchPercentage : -1;
            const scoreB = b.matchPercentage !== undefined ? b.matchPercentage : -1;
            return scoreB - scoreA;
          });
          
          this.freelancers = mappedFreelancers;
          this.isAIApplied = true;
        }
        this.isAIMatching = false;
      },
      error: (err) => {
        console.error('AI Matching failed:', err);
        this.isAIMatching = false;
      }
    });
  }

  clearAIMatch(): void {
    this.isAIApplied = false;
    this.searchCategory = '';
    this.searchSkills = [];
    this.searchSkillInput = '';
    this.freelancers = [...this.rawFreelancers];
  }

  viewProfile(id: string): void {
    this.router.navigate(['/profile'], { queryParams: { id } });
  }
}
