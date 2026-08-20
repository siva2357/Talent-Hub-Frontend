import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { Contract } from '../../../core/models/contract.model';

@Component({
  selector: 'app-manage-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-contract.html',
  styleUrl: './manage-contract.css'
})

export class ManageContract implements OnInit {
  allContracts: Contract[] = [];
  isLoading: boolean = true;

  constructor(
    private contractService: ContractService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchContracts();
  }

  fetchContracts(): void {
    this.isLoading = true;
    this.contractService.getMyContracts().subscribe({
      next: (res) => {
        this.allContracts = res.contracts || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contracts:', err);
        this.isLoading = false;
      }
    });
  }

  deleteContract(id: string): void {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contractService.deleteContract(id).subscribe({
        next: () => {
          this.allContracts = this.allContracts.filter(c => c._id !== id);
        },
        error: (err) => console.error('Delete error', err)
      });
    }
  }

  viewApplicants(id: string): void {
    this.router.navigate(['/applicants', id]);
  }

  editContract(id: string): void {
    this.router.navigate(['/create-contract'], { queryParams: { id } });
  }

  navigateToCreateContract(): void {
    this.router.navigate(['/create-contract']);
  }
}
