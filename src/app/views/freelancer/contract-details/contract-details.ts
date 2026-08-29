import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { Contract } from '../../../core/models/contract.model';
import { CommonModule } from '@angular/common';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';
import { StatCardData } from '../../../core/models/ui.model';

@Component({
  selector: 'app-contract-details',
  imports: [RouterLink, CommonModule, Button, Badge, StatCard],
  templateUrl: './contract-details.html',
  styleUrl: './contract-details.css'
})
export class ContractDetails implements OnInit {
  contractId: string | null = null;
  contract: Contract | null = null;
  isLoading = true;
  isApplying = false;
  isApplied = false; // We can set this if the backend tells us they already applied
  isSaved = false;
  isSaving = false;
  actionMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  get projectStats(): StatCardData[] {
    if (!this.contract) return [];

    // Helper to format date
    const formatDate = (d: string | Date | undefined) => {
      if (!d) return 'Not Set';
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return [
      { title: 'Contract Type', value: this.contract.contractType || 'N/A', icon: 'bi-file-earmark-text' },
      { title: 'Estimated Budget', value: `${this.contract.currency || '$'} ${this.contract.estimatedBudget || 0}`, icon: 'bi-wallet2' },
      { title: 'Category', value: this.contract.contractCategory || 'General', icon: 'bi-folder' },
      { title: 'Start Date', value: formatDate(this.contract.contractStartDate), icon: 'bi-calendar-event' },
      { title: 'End Date', value: formatDate(this.contract.contractEndDate), icon: 'bi-calendar-x' }
    ];
  }

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
          if (this.contract && (this.contract as any).hasSaved !== undefined) {
            this.isSaved = (this.contract as any).hasSaved;
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

  toggleSave(): void {
    if (!this.contractId || this.isSaving) return;
    this.isSaving = true;

    if (this.isSaved) {
      this.contractService.unsaveContract(this.contractId).subscribe({
        next: (res) => {
          if (res.success) {
            this.isSaved = false;
          }
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Failed to unsave', err);
          this.isSaving = false;
        }
      });
    } else {
      this.contractService.saveContract(this.contractId).subscribe({
        next: (res) => {
          if (res.success) {
            this.isSaved = true;
          }
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Failed to save', err);
          this.isSaving = false;
        }
      });
    }
  }
}
