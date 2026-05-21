import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';

@Component({
  selector: 'app-your-contracts',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InputComponent,
    ButtonComponent,
    FormsModule,
    ChipComponent
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

    return this.contracts.filter((contract) => {

      const matchesStatus =

        !this.appliedStatus ||

        contract.status === this.appliedStatus;

      const matchesSearch =

        !this.appliedSearch ||

        contract.contractTitle
          ?.toLowerCase()
          .includes(
            this.appliedSearch.toLowerCase()
          );

      return matchesStatus && matchesSearch;

    });

  }

  // ========================================
  // APPLY FILTERS
  // ========================================

  applyFilters(): void {

    this.appliedSearch = this.searchQuery;

    this.appliedStatus = this.statusFilter;

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

}