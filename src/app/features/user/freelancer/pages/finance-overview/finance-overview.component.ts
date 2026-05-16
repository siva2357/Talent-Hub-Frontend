import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-finance-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './finance-overview.component.html',
  styleUrl: './finance-overview.component.css'
})
export class FinanceOverviewComponent {
  private router = inject(Router);

  // Financial Stats
  totalEarnings = 12450.00;
  paymentsReceived = 9800.00;
  amountWithdrawn = 8500.00;
  balanceLeft = 1300.00;

  // Mock Contract Data with Phase breakdown
  contracts = [
    {
      title: 'E-commerce Platform Development',
      client: 'RetailGenius Inc.',
      totalEarned: 4500.00,
      lastPaymentDate: '2026-05-12',
      status: 'Ongoing',
      type: 'Fixed Price',
      phases: [
        { name: 'UI/UX Design Mockups', amount: 1200.00, status: 'Paid', date: '2026-04-15' },
        { name: 'Frontend Implementation', amount: 1800.00, status: 'Paid', date: '2026-05-12' },
        { name: 'Backend API Integration', amount: 1500.00, status: 'In Review', date: '-' }
      ]
    },
    {
      title: 'Mobile Banking App UI/UX',
      client: 'Fintech Solutions',
      totalEarned: 3200.00,
      lastPaymentDate: '2026-05-10',
      status: 'Completed',
      type: 'Hourly',
      phases: [
        { name: 'Discovery & Wireframes', amount: 800.00, status: 'Paid', date: '2026-04-20' },
        { name: 'High-Fidelity UI Design', amount: 1400.00, status: 'Paid', date: '2026-05-01' },
        { name: 'Prototyping & Handoff', amount: 1000.00, status: 'Paid', date: '2026-05-10' }
      ]
    },
    {
      title: 'AI Chatbot Integration',
      client: 'TechFlow AI',
      totalEarned: 1950.00,
      lastPaymentDate: '2026-05-14',
      status: 'Ongoing',
      type: 'Hourly',
      phases: [
        { name: 'NLU Model Training', amount: 950.00, status: 'Paid', date: '2026-05-14' },
        { name: 'API Hook Setup', amount: 1000.00, status: 'Pending', date: '-' }
      ]
    }
  ];

  selectedContract: any = null;

  toggleContractDetails(contract: any) {
    this.selectedContract = this.selectedContract === contract ? null : contract;
  }

  viewStatements() {
    this.router.navigate(['/user/finance-report']);
  }

  viewAllTransactions() {
    this.router.navigate(['/user/finance-management']);
  }

  withdraw() {
    this.router.navigate(['/user/finance-management']);
  }
}
