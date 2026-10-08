import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';

import { ProfileService } from '../../../core/services/profile.service';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Loader } from '../../../library/ui/components/loader/loader';
import { ContractCard } from '../../../library/shared/components/contract-card/contract-card';
import { Contract } from '../../../core/models/contract.model';
import { InputOption } from '../../../core/models/ui.model';
import { MasterDataService } from '../../../core/services/master-data.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-find-contracts',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Loader, ContractCard],
  templateUrl: './find-contracts.html',
  styleUrl: './find-contracts.css'
})
export class FindContracts implements OnInit {
  activeTab: 'discover' | 'saved' = 'discover';
  rawContracts$ = new BehaviorSubject<Contract[]>([]);
  contracts: Contract[] = [];
  savedContracts: Contract[] = [];
  isLoading: boolean = true;
  isAIMatching: boolean = false;
  isAIApplied: boolean = false;

  // Filter states
  searchQuery = '';
  searchCategory = 'all';
  searchBudget = '';

  appliedFilters$ = new BehaviorSubject<{ query: string; category: string; budget: string }>({ query: '', category: 'all', budget: '' });

  activeFilters: { label: string, type: string, value: string }[] = [];
  categoryOptions: InputOption[] = [{ label: 'All Categories', value: 'all' }];

  private filterSubscription?: Subscription;

  constructor(
    private contractService: ContractService,

    private profileService: ProfileService,
    private router: Router,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
    this.fetchMasterData();
    this.setupReactiveFilters();
    this.fetchContracts();
    this.fetchSavedContractsBackground();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  fetchMasterData(): void {
    this.masterDataService.getMasterDataByCategory('ContractCategories').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const fetchedOptions = res.data.map((item: any) => ({ label: item.value, value: item.key }));
          this.categoryOptions = [{ label: 'All Categories', value: 'all' }, ...fetchedOptions];
        }
      },
      error: (err) => console.error('Failed to fetch master data', err)
    });
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

  mapToCardData(c: Contract): any {
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
          this.rawContracts$.next(res.contracts);
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
  setupReactiveFilters(): void {
    this.filterSubscription = combineLatest([
      this.rawContracts$,
      this.appliedFilters$
    ]).subscribe(([contracts, filters]) => {
      if (this.isAIApplied) return;

      this.activeFilters = [];
      let filtered = [...contracts];

      const { query, category, budget } = filters;

      if (query) {
        const q = query.toLowerCase();
        this.activeFilters.push({ label: `Search: ${query}`, type: 'search', value: query });
        filtered = filtered.filter(c =>
          c.contractTitle.toLowerCase().includes(q) ||
          c.contractDescription.toLowerCase().includes(q)
        );
      }

      if (category && category !== 'all') {
        const catLabel = this.categoryOptions.find(o => o.value === category)?.label || category;
        this.activeFilters.push({ label: `Category: ${catLabel}`, type: 'category', value: category });
        filtered = filtered.filter(c =>
          (c.contractCategory && c.contractCategory.toLowerCase().includes(category.toLowerCase())) ||
          (c.contractSubject && c.contractSubject.toLowerCase().includes(category.toLowerCase()))
        );
      }

      if (budget) {
        this.activeFilters.push({ label: `Budget: ${budget}`, type: 'budget', value: budget });
        const budgetNum = parseFloat(budget);
        if (!isNaN(budgetNum)) {
          filtered = filtered.filter(c => c.estimatedBudget >= budgetNum);
        }
      }

      this.contracts = filtered.map(c => this.mapToCardData(c));
    });
  }

  applyFilters(): void {
    this.appliedFilters$.next({
      query: this.searchQuery,
      category: this.searchCategory,
      budget: this.searchBudget
    });
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

  toggleSave(cardData: Contract): void {
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

  viewDetails(cardData: Contract): void {
    this.router.navigate(['/contract-details', cardData._id]);
  }

}
