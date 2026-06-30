import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { ChipComponent } from "../../../../../shared/components/chip/chip.component";

import { ContractService } from '../../../../../core/services/contract.service';

import { Contract } from '../../../../../core/model/contract.model';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-find-contracts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonComponent,
    InputComponent,
    ChipComponent
  ],
  templateUrl: './find-contracts.component.html',
  styleUrl: './find-contracts.component.css'
})

export class FindContractsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private contractService = inject(ContractService);
  private router = inject(Router)

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All Categories');

  draftSearchQuery = signal<string>('');
  draftCategory = signal<string>('All Categories');

  activeTab = signal<'discover' | 'saved'>('discover');

  isLoading = signal<boolean>(false);
  contracts = signal<Contract[]>([]);
  savedContracts = signal<Contract[]>([]);

  categories = [
    'All Categories',
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'DevOps',
    'Data Science'
  ];

  categoryOptions = this.categories.map(c => ({ label: c, value: c }));

  ngOnInit(): void {
    this.getContracts();
    this.loadSavedContracts();
  }

  loadSavedContracts(): void {
    this.contractService.getSavedContracts().subscribe({
      next: (res) => {
        this.savedContracts.set(res.contracts || []);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getContracts(): void {
    this.isLoading.set(true);
    this.contractService.getAllContracts().subscribe({
      next: (res) => {
        this.contracts.set(res.contracts || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  saveContract(id: string): void {
    const contractInAll = this.contracts().find(c => c._id === id);
    const contractInSaved = this.savedContracts().find(c => c._id === id);
    const hasSaved = contractInAll ? contractInAll.hasSaved : (contractInSaved ? true : false);

    if (hasSaved) {
      this.contractService.unsaveContract(id).subscribe({
        next: () => {
          this.contracts.update(arr => arr.map(c =>
            c._id === id ? { ...c, hasSaved: false } : c
          ));
          this.savedContracts.update(arr => arr.filter(c => c._id !== id));
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      this.contractService.saveContract(id).subscribe({
        next: () => {
          this.contracts.update(arr => arr.map(c =>
            c._id === id ? { ...c, hasSaved: true } : c
          ));
          this.loadSavedContracts();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  applyFilters(): void {
    this.searchQuery.set(this.draftSearchQuery());
    this.selectedCategory.set(this.draftCategory());
  }

  resetFilters(): void {
    this.draftSearchQuery.set('');
    this.draftCategory.set('All Categories');
    this.applyFilters();
  }

  removeCategoryFilter(): void {
    this.draftCategory.set('All Categories');
    this.selectedCategory.set('All Categories');
  }

  filteredContracts = computed(() => {
    return this.contracts().filter((c: Contract) => {
      const q = this.searchQuery().toLowerCase();
      const matchesSearch =
        c.contractTitle?.toLowerCase().includes(q) ||
        c.contractDescription?.toLowerCase().includes(q);

      const cat = this.selectedCategory();
      const matchesCategory = cat === 'All Categories' || c.contractType === cat;

      return matchesSearch && matchesCategory;
    });
  });

  viewContract(id: string): void {
    this.router.navigate(['/user/contract-details'], { queryParams: { id } });
  }
}