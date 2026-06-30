import { Component, OnInit, signal } from '@angular/core';
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

  contractId = signal<string>('');
  contract = signal<Contract | null>(null);
  isLoading = signal<boolean>(false);
  isApplying = signal<boolean>(false);
  isWithdrawing = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.contractId.set(params['id']);
      if (this.contractId()) {
        this.getSingleContract();
      }
    });
  }

  // ========================================
  // Get Single Contract
  // ========================================

  getSingleContract(): void {
    this.isLoading.set(true);
    this.contractService.getSingleContract(this.contractId()).subscribe({
      next: (res) => {
        this.contract.set(res.contract);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  // ========================================
  // Apply To Contract
  // ========================================

  applyToContract(): void {
    this.isApplying.set(true);
    this.contractService.applyToContract(this.contractId()).subscribe({
      next: () => {
        this.contract.update(c => {
          if (c) {
            c.hasApplied = true;
            c.totalApplicants = (c.totalApplicants || 0) + 1;
          }
          return c;
        });
        this.isApplying.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isApplying.set(false);
      }
    });
  }

  // ========================================
  // Withdraw Contract Application
  // ========================================

  withdrawApplication(): void {
    this.isWithdrawing.set(true);
    this.contractService.withdrawContractApplication(this.contractId()).subscribe({
      next: () => {
        this.contract.update(c => {
          if (c) {
            c.hasApplied = false;
            c.totalApplicants = Math.max((c.totalApplicants || 1) - 1, 0);
          }
          return c;
        });
        this.isWithdrawing.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isWithdrawing.set(false);
      }
    });
  }

  toggleSaveContract(): void {
    const currentContract = this.contract();
    if (!currentContract) return;

    if (currentContract.hasSaved) {
      this.contractService.unsaveContract(this.contractId()).subscribe({
        next: () => {
          this.contract.update(c => {
            if (c) c.hasSaved = false;
            return c;
          });
        },
        error: (err) => console.error(err)
      });
    } else {
      this.contractService.saveContract(this.contractId()).subscribe({
        next: () => {
          this.contract.update(c => {
            if (c) c.hasSaved = true;
            return c;
          });
        },
        error: (err) => console.error(err)
      });
    }
  }

}