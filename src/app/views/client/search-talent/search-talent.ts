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
  imports: [CommonModule, FormsModule, TalentCard],
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

  toggleAIFilter(): void {
    this.showAIFilter = !this.showAIFilter;
  }

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

  fetchFreelancers(): void {
    this.isLoading = true;
    this.profileService.getAllFreelancers().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && (res.items || res.data)) {
          this.rawFreelancers = res.items || res.data;
          this.freelancers = [...this.rawFreelancers];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching freelancers', err);
      }
    });
  }

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
