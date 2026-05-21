import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonComponent } from "../../../../../shared/components/button/button.component";

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';

@Component({
  selector: 'app-find-contracts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent
  ],
  templateUrl: './find-contracts.component.html',
  styleUrl: './find-contracts.component.css'
})

export class FindContractsComponent implements OnInit {

  private contractService = inject(ContractService);
  private router = inject(Router)

  searchQuery: string = '';
  selectedCategory: string = 'All Categories';
  selectedLevel: string = 'All Levels';

  isLoading: boolean = false;

  categories = [
    'All Categories',
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'DevOps',
    'Data Science'
  ];

  experienceLevels = [
    'All Levels',
    'Entry',
    'Intermediate',
    'Expert'
  ];

  contracts: Contract[] = [];



  // ========================================
  // Init
  // ========================================

  ngOnInit(): void {

    this.getContracts();

  }



  // ========================================
  // Get All Contracts
  // ========================================

  getContracts(): void {

    this.isLoading = true;

    this.contractService.getAllContracts().subscribe({

      next: (res) => {

        this.contracts = res.contracts || [];

        this.isLoading = false;

      },

      error: (err) => {

        console.error(err);

        this.isLoading = false;

      }

    });

  }

// ========================================
// Save Contract
// ========================================

saveContract(id: string): void {

  this.contractService.saveContract(id).subscribe({

    next: (res) => {

      this.contracts = this.contracts.map((contract) => {

        if (contract._id === id) {

          return {
            ...contract,
            hasSaved: true
          };

        }

        return contract;

      });

    },

    error: (err) => {

      console.error(err);

    }

  });

}

  // ========================================
  // Filter Contracts
  // ========================================

  get filteredContracts(): Contract[] {

    return this.contracts.filter((c: Contract) => {

      const matchesSearch =
        c.contractTitle?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||

        c.contractDescription?.toLowerCase().includes(this.searchQuery.toLowerCase());

      // const matchesLevel =
      //   this.selectedLevel === 'All Levels' ||

      //   c.experienceLevel === this.selectedLevel;

      return matchesSearch ;

    });

  }



viewContract(id: string): void {

  this.router.navigate(
    ['/user/contract-details'],
    {
      queryParams: {
        id
      }
    }
  );

}

}