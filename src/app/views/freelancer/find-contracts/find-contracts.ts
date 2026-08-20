import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { Contract } from '../../../core/models/contract.model';

@Component({
  selector: 'app-find-contracts',
  imports: [CommonModule],
  templateUrl: './find-contracts.html',
  styleUrl: './find-contracts.css'
})
export class FindContracts implements OnInit {
  contracts: Contract[] = [];
  isLoading: boolean = true;

  constructor(
    private contractService: ContractService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchContracts();
  }

  fetchContracts(): void {
    this.contractService.getAllContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.contracts = res.contracts;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch contracts', err);
        this.isLoading = false;
      }
    });
  }

  viewDetails(id: string): void {
    this.router.navigate(['/contract-details', id]);
  }
}
