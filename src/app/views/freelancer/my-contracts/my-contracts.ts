import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';

@Component({
  selector: 'app-my-contracts',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './my-contracts.html',
  styleUrl: './my-contracts.css'
})
export class MyContracts implements OnInit {
  isLoading = true;
  currentTab: 'active' | 'completed' = 'active';
  activeContracts: any[] = [];
  completedContracts: any[] = [];

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.fetchMyContracts();
  }

  fetchMyContracts(): void {
    this.isLoading = true;
    this.contractService.getFreelancerMyContracts().subscribe({
      next: (res) => {
        if (res.success) {
          // Contracts with status "in progress" are active
          this.activeContracts = res.contracts.filter(c => c.status === 'in progress' || c.status === 'open' || c.status === 'draft');
          
          // Contracts with status "completed" or "closed" are completed
          this.completedContracts = res.contracts.filter(c => c.status === 'completed' || c.status === 'closed');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching freelancer contracts:', err);
        this.isLoading = false;
      }
    });
  }

  getDuration(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} Days`;
    }
    const diffMonths = Math.round(diffDays / 30);
    return `${diffMonths} Months`;
  }
}
