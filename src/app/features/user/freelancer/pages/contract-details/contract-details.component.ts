import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ButtonComponent } from '../../../../../shared/components/button/button.component';

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent
  ],
  templateUrl: './contract-details.component.html',
  styleUrl: './contract-details.component.css'
})
export class ContractDetailsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  contractId: string = '';

  contract!: Contract;

  isLoading: boolean = false;

  isApplying: boolean = false;

  isWithdrawing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.contractId = params['id'];

      if (this.contractId) {

        this.getSingleContract();

      }

    });

  }

  // ========================================
  // Get Single Contract
  // ========================================

  getSingleContract(): void {

    this.isLoading = true;

    this.contractService.getSingleContract(this.contractId).subscribe({

      next: (res) => {

        this.contract = res.contract;

        this.isLoading = false;

      },

      error: (err) => {

        console.error(err);

        this.isLoading = false;

      }

    });

  }

 // ========================================
// Apply To Contract
// ========================================

applyToContract(): void {

  this.isApplying = true;

  this.contractService.applyToContract(this.contractId).subscribe({

    next: () => {

      this.contract.hasApplied = true;

      this.contract.totalApplicants =
        (this.contract.totalApplicants || 0) + 1;

      this.isApplying = false;

    },

    error: (err) => {

      console.error(err);

      this.isApplying = false;

    }

  });

}



// ========================================
// Withdraw Contract Application
// ========================================

withdrawApplication(): void {

  this.isWithdrawing = true;

  this.contractService.withdrawContractApplication(this.contractId).subscribe({

    next: () => {

      this.contract.hasApplied = false;

      this.contract.totalApplicants =
        Math.max(
          (this.contract.totalApplicants || 1) - 1,
          0
        );

      this.isWithdrawing = false;

    },

    error: (err) => {

      console.error(err);

      this.isWithdrawing = false;

    }

  });

}

  toggleSaveContract(): void {
    if (!this.contract) return;

    if (this.contract.hasSaved) {
      this.contractService.unsaveContract(this.contractId).subscribe({
        next: () => {
          this.contract.hasSaved = false;
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.contractService.saveContract(this.contractId).subscribe({
        next: () => {
          this.contract.hasSaved = true;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

}