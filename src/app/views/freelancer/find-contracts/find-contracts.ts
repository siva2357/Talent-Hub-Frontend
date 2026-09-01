import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { AIService } from '../../../core/services/ai.service';
import { ProfileService } from '../../../core/services/profile.service';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Loader } from '../../../library/ui/components/loader/loader';
import { ContractCard } from '../../../library/shared/components/contract-card/contract-card';
import { Contract, ContractCardData, AIContractCardData } from '../../../core/models/contract.model';
import { InputOption } from '../../../core/models/ui.model';

@Component({
  selector: 'app-find-contracts',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Loader, ContractCard],
  templateUrl: './find-contracts.html',
  styleUrl: './find-contracts.css'
})
export class FindContracts implements OnInit {
  activeTab: 'discover' | 'saved' = 'discover';
  rawContracts: Contract[] = [];
  contracts: AIContractCardData[] = [];
  savedContracts: AIContractCardData[] = [];
  isLoading: boolean = true;
  isAIMatching: boolean = false;
  isAIApplied: boolean = false;

  // Filter states
  searchQuery = '';
  searchCategory = 'all';
  searchBudget = '';
  activeFilters: { label: string, type: string, value: string }[] = [];

  categoryOptions: InputOption[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Web Development', value: 'web' },
    { label: 'Mobile Development', value: 'mobile' },
    { label: 'UI/UX Design', value: 'design' },
    { label: 'Backend Development', value: 'backend' },
    { label: 'DevOps', value: 'devops' }
  ];

  constructor(
    private contractService: ContractService,
    private aiService: AIService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchContracts();
    this.fetchSavedContractsBackground();
  }

  setTab(tab: 'discover' | 'saved'): void {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.isLoading = true;

    if (tab === 'discover') {
      this.fetchContracts();
    } else {
      this.fetchSavedContracts();
    }
  }

  mapToCardData(c: Contract): ContractCardData {
    return {
      _id: c._id,
      industry: c.industry || 'General',
      contractTitle: c.contractTitle,
      estimatedBudget: c.estimatedBudget,
      contractDescription: c.contractDescription,
      contractStartDate: c.contractStartDate,
      contractEndDate: c.contractEndDate,
      contractType: c.contractType,
      contractSubject: c.contractSubject,
      totalDuration: c.totalDuration || 'Unknown',
      status: c.status,
      hasApplied: c.hasApplied || false,
      hasSaved: this.isContractSaved(c._id)
    };
  }

  fetchContracts(): void {
    this.contractService.getAllContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawContracts = res.contracts;
          this.applyFilters(); // will populate this.contracts
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch contracts', err);
        this.isLoading = false;
      }
    });
  }

  fetchSavedContracts(): void {
    this.contractService.getSavedContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.savedContracts = res.contracts.map(c => this.mapToCardData(c));
          // Refresh discover tab cards to reflect saved state if we are tracking them
          this.contracts = this.contracts.map(c => ({ ...c, hasSaved: this.isContractSaved(c._id || '') }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch saved contracts', err);
        this.isLoading = false;
      }
    });
  }

  fetchSavedContractsBackground(): void {
    this.contractService.getSavedContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.savedContracts = res.contracts.map(c => this.mapToCardData(c));
          // Sync existing contracts list
          this.contracts = this.contracts.map(c => ({ ...c, hasSaved: this.isContractSaved(c._id || '') }));
        }
      }
    });
  }

  isContractSaved(contractId: string): boolean {
    return this.savedContracts.some(c => c._id === contractId);
  }

  // --- Filtering ---
  applyFilters(): void {
    if (this.isAIApplied) return; // Don't filter manually if AI match is active

    this.activeFilters = [];
    let filtered = [...this.rawContracts];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      this.activeFilters.push({ label: `Search: ${this.searchQuery}`, type: 'search', value: this.searchQuery });
      filtered = filtered.filter(c => 
        c.contractTitle.toLowerCase().includes(q) || 
        c.contractDescription.toLowerCase().includes(q)
      );
    }

    if (this.searchCategory !== 'all') {
      const catLabel = this.categoryOptions.find(o => o.value === this.searchCategory)?.label || this.searchCategory;
      this.activeFilters.push({ label: `Category: ${catLabel}`, type: 'category', value: this.searchCategory });
      // In a real app we'd match exact category. Here we use basic inclusion.
      // But assuming 'contractSubject' or 'contractCategory' holds this info.
      filtered = filtered.filter(c => 
        (c.contractCategory && c.contractCategory.toLowerCase().includes(this.searchCategory.toLowerCase())) ||
        (c.contractSubject && c.contractSubject.toLowerCase().includes(this.searchCategory.toLowerCase()))
      );
    }

    if (this.searchBudget) {
      this.activeFilters.push({ label: `Budget: ${this.searchBudget}`, type: 'budget', value: this.searchBudget });
      const budgetNum = parseFloat(this.searchBudget);
      if (!isNaN(budgetNum)) {
         filtered = filtered.filter(c => c.estimatedBudget >= budgetNum);
      }
    }

    this.contracts = filtered.map(c => this.mapToCardData(c));
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.searchCategory = 'all';
    this.searchBudget = '';
    this.applyFilters();
  }

  removeFilter(filterToRemove: { label: string, type: string, value: string }): void {
    if (filterToRemove.type === 'search') this.searchQuery = '';
    else if (filterToRemove.type === 'category') this.searchCategory = 'all';
    else if (filterToRemove.type === 'budget') this.searchBudget = '';
    
    this.applyFilters();
  }

  // --- Actions ---

  toggleSave(cardData: ContractCardData): void {
    const isSaved = cardData.hasSaved;
    cardData.hasSaved = !isSaved;

    if (isSaved) {
      this.contractService.unsaveContract(cardData._id as string).subscribe({
        next: (res) => {
          if (res.success) {
            if (this.activeTab === 'saved') {
              this.savedContracts = this.savedContracts.filter(c => c._id !== cardData._id);
            }
            this.fetchSavedContractsBackground();
          }
        }
      });
    } else {
      this.contractService.saveContract(cardData._id as string).subscribe({
        next: (res) => {
          if (res.success) {
            this.fetchSavedContractsBackground();
          }
        }
      });
    }
  }

  viewDetails(cardData: ContractCardData): void {
    this.router.navigate(['/contract-details', cardData._id]);
  }

  // --- AI ---
  matchWithAI(): void {
    if (this.rawContracts.length === 0) return;
    this.isAIMatching = true;

    this.profileService.getMyProfile().subscribe({
      next: (profileRes) => {
        if (profileRes.success && profileRes.profile) {
          this.aiService.matchContracts(profileRes.profile, this.rawContracts).subscribe({
            next: (aiRes: any) => {
              if (aiRes && aiRes.matches) {
                const matchResults = aiRes.matches;
                let mappedContracts = this.contracts.map(contract => {
                  const match = matchResults.find((m: any) => m.contract_id === contract._id);
                  if (match) {
                    return { ...contract, matchPercentage: match.match_percentage, matchCategory: match.match_category, matchReasoning: match.reasoning };
                  }
                  return contract;
                });

                mappedContracts.sort((a, b) => {
                  const scoreA = a.matchPercentage !== undefined ? a.matchPercentage : -1;
                  const scoreB = b.matchPercentage !== undefined ? b.matchPercentage : -1;
                  return scoreB - scoreA;
                });

                this.contracts = mappedContracts;
                this.isAIApplied = true;
              }
              this.isAIMatching = false;
            },
            error: (err) => {
              console.error('AI Matching failed:', err);
              this.isAIMatching = false;
            }
          });
        } else {
          this.isAIMatching = false;
        }
      },
      error: (err) => {
        console.error('Failed to fetch profile for AI matching:', err);
        this.isAIMatching = false;
      }
    });
  }

  clearAIMatch(): void {
    this.isAIApplied = false;
    this.applyFilters();
  }
}
