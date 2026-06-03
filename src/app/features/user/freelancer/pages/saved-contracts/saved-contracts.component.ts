import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { ContractService } from '../../../../../core/services/contract.service';
import { Contract } from '../../../../../core/model/contract.model';

@Component({
  selector: 'app-saved-contracts',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './saved-contracts.component.html',
  styleUrl: './saved-contracts.component.css'
})
export class SavedContractsComponent implements OnInit {
  private contractService = inject(ContractService);
  private router = inject(Router);

  savedContracts: Contract[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadSavedContracts();
  }

  loadSavedContracts(): void {
    this.isLoading = true;
    this.contractService.getSavedContracts().subscribe({
      next: (res) => {
        this.savedContracts = res.contracts || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  removeContract(id: string) {
    this.contractService.unsaveContract(id).subscribe({
      next: () => {
        this.savedContracts = this.savedContracts.filter(c => c._id !== id);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  viewContract(id: string): void {
    this.router.navigate(['/user/contract-details'], { queryParams: { id } });
  }
}
