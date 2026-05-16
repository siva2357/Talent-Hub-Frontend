import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-finance-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ChipComponent, InputComponent, ButtonComponent],
  templateUrl: './finance-management.component.html',
  styleUrl: './finance-management.component.css'
})
export class FinanceManagementComponent implements OnInit {
  private location = inject(Location);

  // Summary Stats
  totalBalance = 12300.00;
  totalReceived = 45800.00;
  totalWithdrawn = 33500.00;

  // Filter Form
  filterForm = new FormGroup({
    paymentStatus: new FormControl<string | null>(null),
    contractType: new FormControl<string | null>(null)
  });

  // Options
  statusOptions = [
    { label: 'Received', value: 'Received' },
    { label: 'Withdrawn', value: 'Withdrawn' }
  ];

  typeOptions = [
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' }
  ];

  // Active Chips
  activeFilters: { key: string, label: string, value: string }[] = [];

  // Transaction Data
  managementData = [
    {
      title: 'E-commerce Platform Development',
      client: 'RetailGenius Inc.',
      type: 'Fixed Price',
      budget: 15000.00,
      receivedAmount: 5000.00,
      receivedDate: '2026-05-10',
      withdrawnAmount: 0,
      withdrawnDate: null,
      balance: 5000.00,
      status: 'Received'
    },
    {
      title: 'Mobile Banking App UI/UX',
      client: 'Fintech Solutions',
      type: 'Fixed Price',
      budget: 8000.00,
      receivedAmount: 8000.00,
      receivedDate: '2026-04-15',
      withdrawnAmount: 8000.00,
      withdrawnDate: '2026-04-20',
      balance: 0,
      status: 'Withdrawn'
    },
    {
      title: 'Cloud Infrastructure Migration',
      client: 'DataStream Systems',
      type: 'Hourly',
      budget: 5500.00,
      receivedAmount: 3500.00,
      receivedDate: '2026-05-01',
      withdrawnAmount: 2000.00,
      withdrawnDate: '2026-05-05',
      balance: 1500.00,
      status: 'Received'
    },
    {
      title: 'AI Chatbot Integration',
      client: 'TechFlow AI',
      type: 'Hourly',
      budget: 4000.00,
      receivedAmount: 1950.00,
      receivedDate: '2026-05-12',
      withdrawnAmount: 0,
      withdrawnDate: null,
      balance: 1950.00,
      status: 'Received'
    }
  ];

  filteredData = [...this.managementData];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    const values = this.filterForm.value;
    this.activeFilters = [];

    if (values.paymentStatus) {
      this.activeFilters.push({ key: 'paymentStatus', label: `Status: ${values.paymentStatus}`, value: values.paymentStatus });
    }
    if (values.contractType) {
      this.activeFilters.push({ key: 'contractType', label: `Type: ${values.contractType}`, value: values.contractType });
    }

    this.filteredData = this.managementData.filter(item => {
      const matchStatus = !values.paymentStatus || item.status === values.paymentStatus;
      const matchType = !values.contractType || item.type === values.contractType;
      return matchStatus && matchType;
    });
  }

  resetFilters() {
    this.filterForm.reset({
      paymentStatus: null,
      contractType: null
    });
    this.applyFilters();
  }

  removeChip(filter: any) {
    this.filterForm.get(filter.key)?.setValue(null);
    this.applyFilters();
  }

  goBack() {
    this.location.back();
  }

  selectedWithdrawItem: any = null;
  showWithdrawModal: boolean = false;
  agreeToTerms: boolean = false;

  withdraw(item: any) {
    if (item.balance > 0) {
      this.selectedWithdrawItem = item;
      this.showWithdrawModal = true;
      this.agreeToTerms = false;
    }
  }

  closeModal() {
    this.showWithdrawModal = false;
    this.selectedWithdrawItem = null;
    this.agreeToTerms = false;
  }

  confirmWithdrawal() {
    if (this.selectedWithdrawItem) {
      // Simulate withdrawal logic
      const index = this.managementData.findIndex(i => i.title === this.selectedWithdrawItem.title);
      if (index > -1) {
        const item = this.managementData[index];
        item.withdrawnAmount += item.balance;
        item.withdrawnDate = new Date().toISOString().split('T')[0];
        item.balance = 0;
        item.status = 'Withdrawn';
        
        this.totalWithdrawn += item.withdrawnAmount;
        this.totalBalance -= item.withdrawnAmount;
        
        this.applyFilters();
        this.closeModal();
      }
    }
  }

  downloadInvoice(item: any) {
    console.log('Downloading invoice for:', item.title);
  }
}
