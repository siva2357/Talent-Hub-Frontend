

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-your-contracts',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    FormsModule,
    ChipComponent,
    Table,
    BadgeComponent
  ],
  templateUrl: './your-contracts.component.html',
  styleUrl: './your-contracts.component.css'
})
export class YourContractsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  // ========================================
  // FILTER STATES
  // ========================================

  searchQuery: string = '';
  statusFilter: string = '';
  budgetTypeFilter: string = '';
  contractTypeFilter: string = '';

  pendingSearchQuery: string = '';
  pendingStatusFilter: string = '';
  pendingBudgetTypeFilter: string = '';
  pendingContractTypeFilter: string = '';

  loading: boolean = false;

  // ========================================
  // CONTRACTS
  // ========================================

  contracts: Contract[] = [];

  // ========================================
  // STATUS OPTIONS
  // ========================================

  statusOptions = [
    {
      label: 'Pending',
      value: 'pending'
    },
    {
      label: 'In Progress',
      value: 'in progress'
    },
    {
      label: 'Completed',
      value: 'completed'
    }
  ];


  contractTypeOptions = [
    { label: 'All Contract Types', value: '' },
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Full Stack', value: 'Full Stack' },
    { label: 'Mobile', value: 'Mobile' },
    { label: 'UI/UX', value: 'UI/UX' }
  ];

  budgetTypeOptions = [
    {
      label: 'All Budget Types',
      value: ''
    },
    {
      label: 'Fixed Price',
      value: 'Fixed Price'
    },
    {
      label: 'Hourly',
      value: 'Hourly'
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

  ngOnDestroy(): void {
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


  @ViewChild('titleTemplate', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  contractColumns: any[] = [];

  ngAfterViewInit() {
    setTimeout(() => {
      this.contractColumns = [
        { name: 'Contract Title', prop: 'contractTitle', cellTemplate: this.titleTemplate, width: 250 },
        { name: 'Subject', prop: 'contractSubject' },
        { name: 'Contract Type', prop: 'contractType' },
        { name: 'Budget Type', prop: 'budgetType' },
        { name: 'Estimated Budget', prop: 'estimatedBudget', cellTemplate: this.budgetTemplate },
        { name: 'Start Date', prop: 'contractStartDate', cellTemplate: this.dateTemplate },
        { name: 'End Date', prop: 'contractEndDate', cellTemplate: this.dateTemplate },
        { name: 'Status', prop: 'status', cellTemplate: this.statusTemplate },
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
      
      // Calculate position relative to the clicked button
      const target = (event.currentTarget as HTMLElement).closest('app-button') || event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      // Always open downwards, absolute to the document body
      this.menuTop = rect.bottom + window.scrollY + 8;
      
      // Right-aligned (right edge of menu aligns with right edge of button)
      this.menuLeft = rect.right + window.scrollX - 220; 
    }
  }

  closeActionMenu(): void {
    this.activeActionRow = null;
  }

  // ========================================
  // GET MY CONTRACTS
  // ========================================

  getMyContracts(): void {

    this.loading = true;

    this.contractService
      .getMyContracts()
      .subscribe({

        next: (response) => {

          this.contracts = response.contracts;

          this.loading = false;

        },

        error: (error) => {

          console.error(error);

          this.loading = false;

        }

      });

  }

  // ========================================
  // FILTERED CONTRACTS
  // ========================================
  get filteredContracts(): Contract[] {

    return this.contracts.filter(contract => {

      const searchMatch =
        !this.searchQuery ||
        contract.contractTitle?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const statusMatch =
        !this.statusFilter ||
        contract.status === this.statusFilter;

      const budgetMatch =
        !this.budgetTypeFilter ||
        contract.budgetType === this.budgetTypeFilter;

      const typeMatch =
        !this.contractTypeFilter ||
        contract.contractType === this.contractTypeFilter;

      return (
        searchMatch &&
        statusMatch &&
        budgetMatch &&
        typeMatch
      );

    });

  }

  applyFiltersBtn(): void {
    this.searchQuery = this.pendingSearchQuery;
    this.statusFilter = this.pendingStatusFilter;
    this.budgetTypeFilter = this.pendingBudgetTypeFilter;
    this.contractTypeFilter = this.pendingContractTypeFilter;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.budgetTypeFilter = '';
    this.contractTypeFilter = '';

    this.pendingSearchQuery = '';
    this.pendingStatusFilter = '';
    this.pendingBudgetTypeFilter = '';
    this.pendingContractTypeFilter = '';
  }

  removeSearchChip(): void {
    this.searchQuery = '';
    this.pendingSearchQuery = '';
  }

  removeStatusChip(): void {
    this.statusFilter = '';
    this.pendingStatusFilter = '';
  }

  removeBudgetTypeChip(): void {
    this.budgetTypeFilter = '';
    this.pendingBudgetTypeFilter = '';
  }

  removeContractTypeChip(): void {
    this.contractTypeFilter = '';
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

          this.contracts =
            this.contracts.filter(
              contract => contract._id !== id
            );

        },

        error: (error) => {

          console.error(error);

        }

      });

  }

  // ========================================
  // EDIT CONTRACT
  // ========================================
  editContract(id: string): void {

    this.router.navigate(
      ['/user/contract-form'],
      {
        queryParams: {
          id: id
        }
      }
    );

  }


  viewContract(id: string): void {

    this.router.navigate(
      ['/user/contract-view-details'],
      {
        queryParams: {
          id: id
        }
      }
    );

  }



  viewHiredTalents(id: string): void {

    this.router.navigate(
      ['/user/hired-talent'],
      {
        queryParams: {
          contractId: id
        }
      }
    );

  }


  viewContractDiary(contractId: string): void {

    this.router.navigate(
      ['/user/contract-progress'],
      {
        queryParams: {
          contractId: contractId
        }
      }
    );

  }

}