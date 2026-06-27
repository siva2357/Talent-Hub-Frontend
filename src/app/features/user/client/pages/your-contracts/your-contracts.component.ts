import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef, HostListener, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';
import { Table } from "../../../../../shared/components/table/table.component";
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { ContractStatusEnum, BudgetTypeEnum } from '../../../../../core/enums/contract.enum';
import { Category } from '../../../../../core/enums/category.enum';

@Component({
  selector: 'app-your-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, FormsModule, ChipComponent, Table, BadgeComponent],
  templateUrl: './your-contracts.component.html',
  styleUrl: './your-contracts.component.css'
})
export class YourContractsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;
  ContractStatusEnum = ContractStatusEnum;
  BudgetTypeEnum = BudgetTypeEnum;
  Category = Category;
  destroyRef = inject(DestroyRef);

  // Pagination for cards (Frontend Infinite Scroll)
  displayCount = signal<number>(10);


  // ========================================
  // FILTER STATES
  // ========================================

  searchQuery = signal<string>('');
  statusFilter = signal<string>('');
  budgetTypeFilter = signal<string>('');
  contractTypeFilter = signal<string>('');

  pendingSearchQuery: string = '';
  pendingStatusFilter: string = '';
  pendingBudgetTypeFilter: string = '';
  pendingContractTypeFilter: string = '';

  loading = signal<boolean>(false);
  contracts = signal<Contract[]>([]);

  statusOptions = [
    {
      label: 'Pending',
      value: ContractStatusEnum.PENDING
    },
    {
      label: 'In Progress',
      value: ContractStatusEnum.IN_PROGRESS
    },
    {
      label: 'Completed',
      value: ContractStatusEnum.COMPLETED
    }
  ];


  contractTypeOptions = [
    { label: 'All Contract Types', value: '' },
    { label: Category.WebDevelopment, value: Category.WebDevelopment },
    { label: Category.MobileDevelopment, value: Category.MobileDevelopment },
    { label: Category.UIUXDesign, value: Category.UIUXDesign },
    { label: Category.DataScience, value: Category.DataScience },
    { label: Category.Marketing, value: Category.Marketing },
    { label: Category.ContentWriting, value: Category.ContentWriting }
  ];

  budgetTypeOptions = [
    {
      label: 'All Budget Types',
      value: ''
    },
    {
      label: 'Fixed Price',
      value: BudgetTypeEnum.FIXED_PRICE
    },
    {
      label: 'Hourly',
      value: BudgetTypeEnum.HOURLY_RATE
    }
  ];


  constructor(
    private router: Router,
    private contractService: ContractService
  ) { }

  // ========================================
  // ON INIT
  // ========================================

  ngOnInit(): void {
    this.getMyContracts();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.activeActionRow) {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-dropdown') && !target.closest('.action-menu')) {
        this.closeActionMenu();
      }
    }
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    // Check if user has scrolled near the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
      // If we haven't displayed all filtered contracts yet, load 10 more
      if (this.displayCount() < this.filteredContracts().length) {
        this.displayCount.update(count => count + 10);
      }
    }
  }


  @ViewChild('titleTemplate', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  contractColumns: any[] = [];

  ngAfterViewInit() {
    setTimeout(() => {
      this.contractColumns = [
        { name: 'Contract Title', prop: 'contractTitle', cellTemplate: this.titleTemplate, width: 220 },
        { name: 'Subject', prop: 'contractSubject', width: 150 },
        { name: 'Contract Type', prop: 'contractType', width: 150 },
        { name: 'Budget Type', prop: 'budgetType', width: 150 },
        { name: 'Estimated Budget', prop: 'estimatedBudget', cellTemplate: this.budgetTemplate, width: 150 },
        { name: 'Start Date', prop: 'contractStartDate', cellTemplate: this.dateTemplate, width: 150 },
        { name: 'End Date', prop: 'contractEndDate', cellTemplate: this.dateTemplate, width: 150 },
        { name: 'Status', prop: 'status', cellTemplate: this.statusTemplate, width: 150 },
        { name: 'Actions', prop: 'actions', cellTemplate: this.actionTemplate, sortable: false, width: 120 }
      ];
    });
  }

  viewApplicants(id: string): void {

    this.router.navigate(
      ['/user/contract-proposals'],
      {
        queryParams: {
          contractId: id
        }
      }
    );

  }

  activeActionRow: Contract | null = null;
  menuTop: number = 0;
  menuLeft: number = 0;

  toggleActionMenu(event: MouseEvent, row: Contract): void {
    event.stopPropagation();

    if (this.activeActionRow && this.activeActionRow._id === row._id) {
      this.closeActionMenu();
    } else {
      this.activeActionRow = row;
      const target = (event.currentTarget as HTMLElement).closest('app-button') || event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.menuTop = rect.bottom + 8;
      this.menuLeft = rect.right - 220;
    }
  }

  closeActionMenu(): void {
    this.activeActionRow = null;
  }

  // ========================================
  // GET MY CONTRACTS
  // ========================================

  getMyContracts(): void {
    console.log('1. [API Flow] Starting fetch for contracts...');
    this.loading.set(true);
    this.contractService.getMyContracts().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('2. [API Flow] Data arrived! Setting contracts signal.', response.contracts);
          this.contracts.set(response.contracts);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        }
      });
  }

  // ========================================
  // FILTERED CONTRACTS
  // ========================================
  filteredContracts = computed(() => {
    console.log('3. [Signals Flow] Running filter logic! Data or Filters changed.');
    return this.contracts().filter(contract => {

      const searchMatch =
        !this.searchQuery() ||
        contract.contractTitle?.toLowerCase().includes(this.searchQuery().toLowerCase());

      const statusMatch =
        !this.statusFilter() ||
        contract.status === this.statusFilter();

      const budgetMatch =
        !this.budgetTypeFilter() ||
        contract.budgetType === this.budgetTypeFilter();

      const typeMatch =
        !this.contractTypeFilter() ||
        contract.contractType === this.contractTypeFilter();

      return (
        searchMatch &&
        statusMatch &&
        budgetMatch &&
        typeMatch
      );

    });

  });

  applyFiltersBtn(): void {
    this.searchQuery.set(this.pendingSearchQuery);
    this.statusFilter.set(this.pendingStatusFilter);
    this.budgetTypeFilter.set(this.pendingBudgetTypeFilter);
    this.contractTypeFilter.set(this.pendingContractTypeFilter);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');
    this.budgetTypeFilter.set('');
    this.contractTypeFilter.set('');

    this.pendingSearchQuery = '';
    this.pendingStatusFilter = '';
    this.pendingBudgetTypeFilter = '';
    this.pendingContractTypeFilter = '';
  }

  removeSearchChip(): void {
    this.searchQuery.set('');
    this.pendingSearchQuery = '';
  }

  removeStatusChip(): void {
    this.statusFilter.set('');
    this.pendingStatusFilter = '';
  }

  removeBudgetTypeChip(): void {
    this.budgetTypeFilter.set('');
    this.pendingBudgetTypeFilter = '';
  }

  removeContractTypeChip(): void {
    this.contractTypeFilter.set('');
    this.pendingContractTypeFilter = '';
  }

  // ========================================
  // DELETE CONTRACT
  // ========================================

  deleteContract(id: string): void {
    const confirmed = confirm(
      'Are you sure you want to delete this contract?'
    );
    if (!confirmed) return;
    this.contractService
      .deleteContract(id)
      .subscribe({
        next: () => {
          this.contracts.update(contracts =>
            contracts.filter(contract => contract._id !== id)
          );
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  editContract(id: string): void {
    this.router.navigate(['/user/contract-form'], { queryParams: { id: id } });
  }

  viewContract(id: string): void {
    this.router.navigate(['/user/contract-view-details'], { queryParams: { id: id } });
  }

  viewHiredTalents(id: string): void {
    this.router.navigate(['/user/hired-talent'], { queryParams: { contractId: id } });
  }

  viewContractDiary(contractId: string): void {
    this.router.navigate(['/user/contract-progress'], { queryParams: { contractId: contractId } });
  }

}