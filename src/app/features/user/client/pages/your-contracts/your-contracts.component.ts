import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef, HostListener, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DropdownComponent, DropdownAction } from '../../../../../shared/components/dropdown/dropdown.component';

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';
import { Table } from "../../../../../shared/components/table/table.component";
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { ContractStatusEnum, BudgetTypeEnum } from '../../../../../core/enums/contract.enum';
import { Category } from '../../../../../core/enums/category.enum';
import { AlertModalService } from '../../../../../core/services/alert-modal.service';

@Component({
  selector: 'app-your-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, FormsModule, ChipComponent, Table, BadgeComponent, DropdownComponent],
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
    private contractService: ContractService,
    private alertModalService: AlertModalService
  ) { }

  // ========================================
  // ON INIT
  // ========================================

  ngOnInit(): void {
    this.getMyContracts();
  }



  @HostListener('window:scroll', ['$event'])
  onScroll(event?: Event): void {
    // Check if user has scrolled near the bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
      // If we haven't displayed all filtered contracts yet, load 10 more
      if (this.displayCount() < this.filteredContracts().length) {
        this.displayCount.update(count => count + 10);
      }
    }
  }


  @ViewChild('snoTemplate', { static: true }) snoTemplate!: TemplateRef<any>;
  @ViewChild('titleTemplate', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  contractColumns: any[] = [];

  ngAfterViewInit() {
    setTimeout(() => {
      this.contractColumns = [
        { name: 'S.No', prop: 'sno', cellTemplate: this.snoTemplate, width: 70 },
        { name: 'Contract Title', prop: 'contractTitle', cellTemplate: this.titleTemplate, width: 220 },
        { name: 'Subject', prop: 'contractSubject', width: 150 },
        { name: 'Contract Type', prop: 'contractType', width: 150 },

        { name: 'Budget', prop: 'estimatedBudget', cellTemplate: this.budgetTemplate, width: 150 },
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

  getActions(contract: Contract): DropdownAction[] {
    return [
      { label: 'View Contract', value: 'view', icon: 'bi-eye' },
      { label: 'Applicants', value: 'applicants', icon: 'bi-people' },
      { label: 'View Hired Talents', value: 'hired', icon: 'bi-people' },
      { label: 'View Contract Progress', value: 'diary', icon: 'bi-people' },
      { label: 'Edit', value: 'edit', icon: 'bi-pencil' },
      { label: 'Delete', value: 'delete', icon: 'bi-trash text-danger' }
    ];
  }

  handleAction(actionValue: string, contract: Contract) {
    if (actionValue === 'view') this.viewContract(contract._id);
    else if (actionValue === 'applicants') this.viewApplicants(contract._id);
    else if (actionValue === 'hired') this.viewHiredTalents(contract._id);
    else if (actionValue === 'diary') this.viewContractDiary(contract._id);
    else if (actionValue === 'edit') this.editContract(contract._id);
    else if (actionValue === 'delete') this.deleteContract(contract._id);
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

      const typeMatch =
        !this.contractTypeFilter() ||
        contract.contractType === this.contractTypeFilter();

      return (
        searchMatch &&
        statusMatch &&
        typeMatch
      );

    });

  });

  applyFiltersBtn(): void {
    this.searchQuery.set(this.pendingSearchQuery);
    this.statusFilter.set(this.pendingStatusFilter);

    this.contractTypeFilter.set(this.pendingContractTypeFilter);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('');

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
    this.alertModalService.show({
      title: 'Delete Contract',
      message: 'Are you sure you want to delete this contract?',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
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