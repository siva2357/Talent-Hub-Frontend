import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';
import { Table } from "../../../../../shared/components/table/table.component";

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
    Table
],
  templateUrl: './your-contracts.component.html',
  styleUrl: './your-contracts.component.css'
})
export class YourContractsComponent implements OnInit {

  // ========================================
  // FILTER STATES
  // ========================================

  searchQuery: string = '';

  statusFilter: string = '';

  appliedSearch: string = '';

  appliedStatus: string = '';

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

budgetTypeFilter = '';
contractTypeFilter = '';

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
  ) {}

  // ========================================
  // ON INIT
  // ========================================

  ngOnInit(): void {

    this.getMyContracts();

  }


  contractColumns = [
  {
    name: 'Contract',
    prop: 'contractTitle'
  },
  {
    name: 'Type',
    prop: 'contractType'
  },
  {
    name: 'Budget',
    prop: 'estimatedBudget'
  },
  {
    name: 'Status',
    prop: 'status'
  },
  {
    name: 'Start Date',
    prop: 'contractStartDate'
  }
];

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

openActionId: string | null = null;

toggleActionMenu(id: string): void {

  this.openActionId =
    this.openActionId === id
      ? null
      : id;

}

closeActionMenu(): void {

  this.openActionId = null;

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
      statusMatch &&
      budgetMatch &&
      typeMatch
    );

  });

}

  // ========================================
  // APPLY FILTERS
  // ========================================

  applyFilters(): void {

    this.appliedSearch = this.searchQuery;

    this.appliedStatus = this.statusFilter;

  }

removeBudgetTypeFilter(): void {
  this.budgetTypeFilter = '';
}

removeContractTypeFilter(): void {
  this.contractTypeFilter = '';
}

  // ========================================
  // RESET FILTERS
  // ========================================

  resetFilters(): void {

    this.searchQuery = '';

    this.statusFilter = '';

    this.appliedSearch = '';

    this.appliedStatus = '';

  }

  // ========================================
  // REMOVE SEARCH FILTER
  // ========================================

  removeSearchFilter(): void {

    this.searchQuery = '';

    this.appliedSearch = '';

  }

  // ========================================
  // REMOVE STATUS FILTER
  // ========================================

  removeStatusFilter(): void {

    this.statusFilter = '';

    this.appliedStatus = '';

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

}