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
  
  rawActiveContracts: any[] = [];
  rawCompletedContracts: any[] = [];
  
  activeContracts: any[] = [];
  completedContracts: any[] = [];

  columns: TableColumn[] = [];

  // Filter States - Active
  searchQueryActive = '';
  selectedCategoryActive = 'all';
  activeFiltersActive: { label: string; type: string; value: string }[] = [];

  // Filter States - Completed
  searchQueryCompleted = '';
  selectedCategoryCompleted = 'all';
  activeFiltersCompleted: { label: string; type: string; value: string }[] = [];

  categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Web Development', value: 'web' },
    { label: 'Mobile Development', value: 'mobile' },
    { label: 'Design', value: 'design' }
  ];

  @ViewChild('titleTemplate', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('clientTemplate', { static: true }) clientTemplate!: TemplateRef<any>;
  @ViewChild('durationTemplate', { static: true }) durationTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  constructor(private contractService: ContractService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMyContracts();
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
          this.rawActiveContracts = res.contracts.filter(c => c.status === 'in progress' || c.status === 'open' || c.status === 'draft');
          this.rawCompletedContracts = res.contracts.filter(c => c.status === 'completed' || c.status === 'closed');
          
          this.applyFiltersActive();
          this.applyFiltersCompleted();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching freelancer contracts:', err);
        this.isLoading = false;
      }
    });
  }

  // --- Active Contracts Filtering ---
  applyFiltersActive(): void {
    this.activeFiltersActive = [];
    let filtered = [...this.rawActiveContracts];

    if (this.searchQueryActive) {
      const q = this.searchQueryActive.toLowerCase();
      this.activeFiltersActive.push({ label: `Search: ${this.searchQueryActive}`, type: 'search', value: this.searchQueryActive });
      filtered = filtered.filter(c => c.contractTitle?.toLowerCase().includes(q) || c.clientName?.toLowerCase().includes(q));
    }

    if (this.selectedCategoryActive !== 'all') {
      const catLabel = this.categoryOptions.find(o => o.value === this.selectedCategoryActive)?.label || this.selectedCategoryActive;
      this.activeFiltersActive.push({ label: `Category: ${catLabel}`, type: 'category', value: this.selectedCategoryActive });
      filtered = filtered.filter(c => c.contractCategory?.toLowerCase().includes(this.selectedCategoryActive.toLowerCase()));
    }

    this.activeContracts = filtered;
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
    this.activeFiltersCompleted = [];
    let filtered = [...this.rawCompletedContracts];

    if (this.searchQueryCompleted) {
      const q = this.searchQueryCompleted.toLowerCase();
      this.activeFiltersCompleted.push({ label: `Search: ${this.searchQueryCompleted}`, type: 'search', value: this.searchQueryCompleted });
      filtered = filtered.filter(c => c.contractTitle?.toLowerCase().includes(q) || c.clientName?.toLowerCase().includes(q));
    }

    if (this.selectedCategoryCompleted !== 'all') {
      const catLabel = this.categoryOptions.find(o => o.value === this.selectedCategoryCompleted)?.label || this.selectedCategoryCompleted;
      this.activeFiltersCompleted.push({ label: `Category: ${catLabel}`, type: 'category', value: this.selectedCategoryCompleted });
      filtered = filtered.filter(c => c.contractCategory?.toLowerCase().includes(this.selectedCategoryCompleted.toLowerCase()));
    }

    this.completedContracts = filtered;
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
