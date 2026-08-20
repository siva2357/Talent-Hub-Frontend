import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { Contract } from '../../../core/models/contract.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contract-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './contract-details.html',
  styleUrl: './contract-details.css'
})
export class ContractDetails implements OnInit {
  contractId: string | null = null;
  contract: Contract | null = null;
  isLoading = true;
  isApplying = false;
  isApplied = false; // We can set this if the backend tells us they already applied
  actionMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    this.contractId = this.route.snapshot.paramMap.get('id');
    if (this.contractId) {
      this.fetchContractDetails();
    } else {
      this.isLoading = false;
    }
  }

  fetchContractDetails(): void {
    this.isLoading = true;
    this.contractService.getContractById(this.contractId!).subscribe({
      next: (res) => {
        if (res.success) {
          this.contract = res.data || (res as any).contract; // Handle different backend response formats
          if (this.contract && (this.contract as any).hasApplied !== undefined) {
             this.isApplied = (this.contract as any).hasApplied;
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch contract details', err);
        this.isLoading = false;
      }
    });
  }

  applyForContract(): void {
    if (!this.contractId) return;
    this.isApplying = true;
    this.actionMessage = null;
    
    this.contractService.applyForContract(this.contractId).subscribe({
      next: (res) => {
        if (res.success) {
          this.isApplied = true;
          this.actionMessage = 'Successfully applied to the contract!';
        }
        this.isApplying = false;
      },
      error: (err) => {
        console.error('Failed to apply', err);
        this.actionMessage = err.error?.message || 'Failed to apply. You might have already applied.';
        this.isApplying = false;
      }
    });
  }

  withdrawApplication(): void {
    if (!this.contractId) return;
    this.isApplying = true;
    this.actionMessage = null;

    this.contractService.withdrawFromContract(this.contractId).subscribe({
      next: (res) => {
        if (res.success) {
          this.isApplied = false;
          this.actionMessage = 'Successfully withdrawn application.';
        }
        this.isApplying = false;
      },
      error: (err) => {
        console.error('Failed to withdraw', err);
        this.actionMessage = err.error?.message || 'Failed to withdraw application.';
        this.isApplying = false;
      }
    });
  }
}
