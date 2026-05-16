import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


@Component({
  selector: 'app-finance-report',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ChipComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './finance-report.component.html',
  styleUrl: './finance-report.component.css'
})
export class FinanceReportComponent implements OnInit {
  private location = inject(Location);
  private router = inject(Router);

  // Filter Form
  filterForm = new FormGroup({
    contractStatus: new FormControl<string | null>(null),
    paymentStatus: new FormControl<string | null>(null),
    contractType: new FormControl<string | null>(null)
  });

  // Filter Options
  contractStatusOptions = [
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' }
  ];

  paymentStatusOptions = [
    { label: 'Received', value: 'Received' },
    { label: 'On Hold', value: 'On Hold' }
  ];

  contractTypeOptions = [
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' },
    { label: 'Monthly Retainer', value: 'Monthly Retainer' }
  ];

  // Active Filter Chips
  activeFilters: { key: string, label: string, value: string }[] = [];

  // Summary Stats for the report
  amountReceived = 18400.00;
  amountPending = 6100.00;

  // Detailed Report Data
  reportData = [
    {
      title: 'E-commerce Platform Development',
      client: 'RetailGenius Inc.',
      budget: 15000.00,
      earned: 12000.00,
      status: 'In Progress',
      type: 'Fixed Price',
      startDate: '2026-01-10',
      endDate: '2026-06-30',
      completion: 80
    },
    {
      title: 'Mobile Banking App UI/UX',
      client: 'Fintech Solutions',
      budget: 8000.00,
      earned: 8000.00,
      status: 'Completed',
      type: 'Fixed Price',
      startDate: '2025-11-15',
      endDate: '2026-05-10',
      completion: 100
    },
    {
      title: 'Cloud Infrastructure Migration',
      client: 'DataStream Systems',
      budget: 5500.00,
      earned: 3500.00,
      status: 'In Progress',
      type: 'Hourly',
      startDate: '2026-03-01',
      endDate: '2026-08-15',
      completion: 60
    },
    {
      title: 'AI Chatbot Integration',
      client: 'TechFlow AI',
      budget: 4000.00,
      earned: 1950.00,
      status: 'In Progress',
      type: 'Hourly',
      startDate: '2026-04-20',
      endDate: '2026-10-30',
      completion: 45
    },
    {
      title: 'SEO & Content Strategy',
      client: 'GreenLife Wellness',
      budget: 3000.00,
      earned: 3000.00,
      status: 'Completed',
      type: 'Monthly Retainer',
      startDate: '2025-12-01',
      endDate: '2026-05-31',
      completion: 100
    }
  ];

  // Filtered Data Display
  filteredData: any[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    const values = this.filterForm.value;
    this.activeFilters = [];

    // Build active chips
    if (values.contractStatus) {
      this.activeFilters.push({ key: 'contractStatus', label: `Status: ${values.contractStatus}`, value: values.contractStatus });
    }
    if (values.paymentStatus) {
      this.activeFilters.push({ key: 'paymentStatus', label: `Payment: ${values.paymentStatus}`, value: values.paymentStatus });
    }
    if (values.contractType) {
      this.activeFilters.push({ key: 'contractType', label: `Type: ${values.contractType}`, value: values.contractType });
    }

    // Filter logic
    this.filteredData = this.reportData.filter((item: any) => {
      const matchStatus = !values.contractStatus || item.status === values.contractStatus;
      const matchType = !values.contractType || item.type === values.contractType;
      
      const paymentStatus = item.completion === 100 ? 'Received' : 'On Hold';
      const matchPayment = !values.paymentStatus || paymentStatus === values.paymentStatus;

      return matchStatus && matchType && matchPayment;
    });
  }

  resetFilters() {
    this.filterForm.reset({
      contractStatus: null,
      paymentStatus: null,
      contractType: null
    });
    this.applyFilters();
  }

  removeChip(filter: { key: string, label: string, value: string }) {
    this.filterForm.get(filter.key)?.setValue(null);
    this.applyFilters();
  }

  goBack() {
    this.location.back();
  }

  downloadReport(format: string) {
    console.log(`Downloading report as ${format}...`);
    // Logic for generating/downloading report would go here
  }

  contactSupport() {
    this.router.navigate(['/user/contact-support']);
  }
}
