import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { ProfileService } from '../../../core/services/profile.service';
import { AIService } from '../../../core/services/ai.service';
import { MasterDataService } from '../../../core/services/master-data.service';
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
export class SearchTalent implements OnInit, OnDestroy {
  rawFreelancers: any[] = [];
  freelancers: any[] = [];
  isLoading = false;
  
  // RxJS Subjects
  freelancersSource$ = new BehaviorSubject<any[]>([]);
  skillFilter$ = new BehaviorSubject<string>('all');
  experienceFilter$ = new BehaviorSubject<string>('all');
  availabilityFilter$ = new BehaviorSubject<string>('all');
  private subscription: Subscription = new Subscription();
  
  // UI State
  showAIFilter = false;
  
  // AI Matching properties
  isAIMatching = false;
  isAIApplied = false;
  searchCategory = '';
  searchSkillInput = '';
  searchSkills: string[] = [];

  // Manual Filter Options
  skillOptions: InputOption[] = [{ label: 'All Skills', value: 'all' }];
  experienceOptions: InputOption[] = [{ label: 'All Levels', value: 'all' }];
  availabilityOptions: InputOption[] = [{ label: 'All Availability', value: 'all' }];

  // Manual Filter state
  selectedSkill = 'all';
  selectedExperience = 'all';
  selectedAvailability = 'all';

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
    private masterDataService: MasterDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupRxJSFilters();
    this.fetchMasterData();
    this.fetchFreelancers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setupRxJSFilters(): void {
    this.subscription.add(
      combineLatest([
        this.freelancersSource$,
        this.skillFilter$,
        this.experienceFilter$,
        this.availabilityFilter$
      ]).subscribe(([freelancers, skill, experience, availability]) => {
        if (this.showAIFilter && this.isAIApplied) return;

        let filtered = [...freelancers];
        this.activeManualFilters = [];

        if (skill !== 'all') {
          const q = skill.toLowerCase();
          this.activeManualFilters.push({ label: `Skill: ${skill}`, type: 'skill', value: skill });
          filtered = filtered.filter(f => 
            (f.skills && Array.isArray(f.skills) && f.skills.some((s: string) => s.toLowerCase() === q)) ||
            (f.professionalHeadline && f.professionalHeadline.toLowerCase().includes(q))
          );
        }

        if (experience !== 'all') {
          const q = experience.toLowerCase();
          this.activeManualFilters.push({ label: `Experience: ${experience}`, type: 'experience', value: experience });
          filtered = filtered.filter(f => f.experienceLevel?.toLowerCase() === q);
        }

        if (availability !== 'all') {
          const q = availability.toLowerCase();
          this.activeManualFilters.push({ label: `Availability: ${availability}`, type: 'availability', value: availability });
          filtered = filtered.filter(f => {
            if (Array.isArray(f.availability)) {
              return f.availability.some((a: string) => a.toLowerCase().includes(q));
            }
            return f.availability?.toLowerCase().includes(q);
          });
        }

        this.freelancers = filtered;
      })
    );
  }

  fetchMasterData(): void {
    this.masterDataService.getAllMasterData().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (res.data['Skills']) {
            this.skillOptions = [{ label: 'All Skills', value: 'all' }, ...res.data['Skills'].map((o: any) => ({ label: o.value, value: o.key }))];
          }
          if (res.data['ExperienceLevel']) {
            this.experienceOptions = [{ label: 'All Levels', value: 'all' }, ...res.data['ExperienceLevel'].map((o: any) => ({ label: o.value, value: o.key }))];
          }
          if (res.data['Availability']) {
            this.availabilityOptions = [{ label: 'All Availability', value: 'all' }, ...res.data['Availability'].map((o: any) => ({ label: o.value, value: o.key }))];
          }
        }
      },
      error: (err) => console.error('Error fetching master data', err)
    });
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
          this.freelancersSource$.next(this.rawFreelancers);
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

    this.skillFilter$.next(this.selectedSkill);
    this.experienceFilter$.next(this.selectedExperience);
    this.availabilityFilter$.next(this.selectedAvailability);
  }

  resetManualFilters(): void {
    this.selectedSkill = 'all';
    this.selectedExperience = 'all';
    this.selectedAvailability = 'all';
    this.applyManualFilters();
  }

  removeManualFilter(filterToRemove: { label: string, type: string, value: string }): void {
    if (filterToRemove.type === 'skill') this.selectedSkill = 'all';
    else if (filterToRemove.type === 'experience') this.selectedExperience = 'all';
    else if (filterToRemove.type === 'availability') this.selectedAvailability = 'all';
    
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
