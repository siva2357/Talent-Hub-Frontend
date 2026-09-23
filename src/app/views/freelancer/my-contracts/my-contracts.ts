import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { Table } from '../../../library/ui/components/table/table';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { TableColumn, DropdownItem } from '../../../core/models/ui.model';
import { MasterDataService } from '../../../core/services/master-data.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [RouterModule, CommonModule, Table, Button,  Badge, InputField, Chip],
  templateUrl: './my-contracts.html',
  styleUrl: './my-contracts.css'
})
export class MyContracts implements OnInit, AfterViewInit {
  isLoading = true;
  currentTab: 'active' | 'completed' = 'active';
  
  rawActiveContracts$ = new BehaviorSubject<any[]>([]);
  rawCompletedContracts$ = new BehaviorSubject<any[]>([]);
  
  activeContracts: any[] = [];
  completedContracts: any[] = [];

  columns: TableColumn[] = [];

  // Filter States - Active
  searchQueryActive = '';
  selectedCategoryActive = 'all';
  activeFiltersActive: { label: string; type: string; value: string }[] = [];
  appliedFiltersActive$ = new BehaviorSubject<{ search: string, category: string }>({ search: '', category: 'all' });

  // Filter States - Completed
  searchQueryCompleted = '';
  selectedCategoryCompleted = 'all';
  activeFiltersCompleted: { label: string; type: string; value: string }[] = [];
  appliedFiltersCompleted$ = new BehaviorSubject<{ search: string, category: string }>({ search: '', category: 'all' });

  categoryOptions = [
    { label: 'All Categories', value: 'all' }
  ];

  private subscriptions = new Subscription();

  @ViewChild('titleTemplate', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('clientTemplate', { static: true }) clientTemplate!: TemplateRef<any>;
  @ViewChild('durationTemplate', { static: true }) durationTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  constructor(private contractService: ContractService, private router: Router, private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.fetchMasterData();
    this.setupReactiveFilters();
    this.fetchMyContracts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchMasterData(): void {
    this.masterDataService.getMasterDataByCategory('ContractCategories').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const fetchedOptions = res.data.map((item: any) => ({ label: item.value, value: item.key }));
          this.categoryOptions = [{ label: 'All Categories', value: 'all' }, ...fetchedOptions];
        }
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: 'contractTitle', headerName: 'CONTRACT', cellTemplate: this.titleTemplate, flexGrow: 1, width: 250 },
        { field: 'clientName', headerName: 'CLIENT', cellTemplate: this.clientTemplate, width: 200 },
        { field: 'duration', headerName: 'DURATION', cellTemplate: this.durationTemplate, width: 150 },
        { field: 'budget', headerName: 'BUDGET', cellTemplate: this.budgetTemplate, width: 120 },
        { field: 'status', headerName: 'STATUS', cellTemplate: this.statusTemplate, width: 120 },
        { field: 'actions', headerName: 'ACTIONS', cellTemplate: this.actionsTemplate, width: 100 }
      ];
    });
  }

  setTab(tab: 'active' | 'completed'): void {
    this.currentTab = tab;
  }

  fetchMyContracts(): void {
    this.isLoading = true;
    this.contractService.getFreelancerMyContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawActiveContracts$.next(res.contracts.filter((c: any) => c.status === 'in progress' || c.status === 'open' || c.status === 'draft'));
          this.rawCompletedContracts$.next(res.contracts.filter((c: any) => c.status === 'completed' || c.status === 'closed'));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching freelancer contracts:', err);
        this.isLoading = false;
      }
    });
  }

  // --- Filters Setup ---
  setupReactiveFilters(): void {
    // Active Contracts Filter
    this.subscriptions.add(
      combineLatest([
        this.rawActiveContracts$,
        this.appliedFiltersActive$
      ]).subscribe(([contracts, filters]) => {
        this.activeFiltersActive = [];
        let filtered = [...contracts];

        const { search, category } = filters;

        if (search) {
          const q = search.toLowerCase();
          this.activeFiltersActive.push({ label: `Search: ${search}`, type: 'search', value: search });
          filtered = filtered.filter(c => c.contractTitle?.toLowerCase().includes(q) || c.clientName?.toLowerCase().includes(q));
        }

        if (category && category !== 'all') {
          const catLabel = this.categoryOptions.find(o => o.value === category)?.label || category;
          this.activeFiltersActive.push({ label: `Category: ${catLabel}`, type: 'category', value: category });
          filtered = filtered.filter(c => c.contractCategory?.toLowerCase().includes(category.toLowerCase()));
        }

        this.activeContracts = filtered;
      })
    );

    // Completed Contracts Filter
    this.subscriptions.add(
      combineLatest([
        this.rawCompletedContracts$,
        this.appliedFiltersCompleted$
      ]).subscribe(([contracts, filters]) => {
        this.activeFiltersCompleted = [];
        let filtered = [...contracts];

        const { search, category } = filters;

        if (search) {
          const q = search.toLowerCase();
          this.activeFiltersCompleted.push({ label: `Search: ${search}`, type: 'search', value: search });
          filtered = filtered.filter(c => c.contractTitle?.toLowerCase().includes(q) || c.clientName?.toLowerCase().includes(q));
        }

        if (category && category !== 'all') {
          const catLabel = this.categoryOptions.find(o => o.value === category)?.label || category;
          this.activeFiltersCompleted.push({ label: `Category: ${catLabel}`, type: 'category', value: category });
          filtered = filtered.filter(c => c.contractCategory?.toLowerCase().includes(category.toLowerCase()));
        }

        this.completedContracts = filtered;
      })
    );
  }

  // --- Active Contracts Filtering ---
  applyFiltersActive(): void {
    this.appliedFiltersActive$.next({
      search: this.searchQueryActive,
      category: this.selectedCategoryActive
    });
  }

  resetFiltersActive(): void {
    this.searchQueryActive = '';
    this.selectedCategoryActive = 'all';
    this.applyFiltersActive();
  }

  removeFilterActive(filterToRemove: { label: string; type: string; value: string }): void {
    if (filterToRemove.type === 'search') this.searchQueryActive = '';
    else if (filterToRemove.type === 'category') this.selectedCategoryActive = 'all';
    this.applyFiltersActive();
  }

  // --- Completed Contracts Filtering ---
  applyFiltersCompleted(): void {
    this.appliedFiltersCompleted$.next({
      search: this.searchQueryCompleted,
      category: this.selectedCategoryCompleted
    });
  }

  resetFiltersCompleted(): void {
    this.searchQueryCompleted = '';
    this.selectedCategoryCompleted = 'all';
    this.applyFiltersCompleted();
  }

  removeFilterCompleted(filterToRemove: { label: string; type: string; value: string }): void {
    if (filterToRemove.type === 'search') this.searchQueryCompleted = '';
    else if (filterToRemove.type === 'category') this.selectedCategoryCompleted = 'all';
    this.applyFiltersCompleted();
  }


  getDuration(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} Days`;
    }
    const diffMonths = Math.round(diffDays / 30);
    return `${diffMonths} Months`;
  }

  getDropdownItems(row: any): DropdownItem[] {
    return [
      { label: 'View Details', value: 'view', icon: 'bi bi-eye' }
    ];
  }

  onDropdownAction(item: DropdownItem, row: any): void {
    if (item.value === 'view') {
      this.router.navigate(['/contract-details', row._id]);
    }
  }
}
