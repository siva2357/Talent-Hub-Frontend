import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spending-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-activities.component.html',
  styleUrl: './spending-activities.component.css'
})
export class SpendingActivitiesComponent {
  // Only fully completed contracts are shown on this page
  contracts = [
    {
      contractId: 'CON-104',
      title: 'Mobile Banking App UI/UX Development',
      type: 'Hourly',
      freelancer: 'John Connor',
      startDate: '2026-05-10',
      endDate: '2026-06-30',
      budget: 3250,
      totalPaid: 3250,
      status: 'Paid'
    },
    {
      contractId: 'CON-405',
      title: 'AI Chatbot Integration & Agent Workflows',
      type: 'Fixed Price',
      freelancer: 'Sarah Connor',
      startDate: '2026-05-12',
      endDate: '2026-08-12',
      budget: 1950,
      totalPaid: 1950,
      status: 'Processed'
    },
    {
      contractId: 'CON-307',
      title: 'Cloud Infrastructure Migration & DevOps Setup',
      type: 'Fixed Price',
      freelancer: 'T-800 Cyberdyne',
      startDate: '2026-04-15',
      endDate: '2026-07-15',
      budget: 5500,
      totalPaid: 5500,
      status: 'Paid'
    }
  ];

  // Helper getters for summary stats cards
  getTotalBudget(): number {
    return this.contracts.reduce((sum, c) => sum + c.budget, 0);
  }

  getTotalSpent(): number {
    return this.contracts.reduce((sum, c) => sum + c.totalPaid, 0);
  }

  getTotalBalance(): number {
    return this.getTotalBudget() - this.getTotalSpent();
  }

  getContractCount(): number {
    return this.contracts.length;
  }

  // Invoice download helper
  downloadInvoice(contractId: string, freelancer: string, amount: number) {
    const invoiceContent = `==================================================
TALENT-HUB INVOICE RECEIPT
==================================================
Contract Reference : ${contractId}
Freelancer         : ${freelancer}
Transaction Amount : $${amount.toFixed(2)}
Payment Status     : COMPLETED (FULLY PAID)
Invoice Reference  : INV-${Math.floor(100000 + Math.random() * 900000)}
Issued Date        : ${new Date().toLocaleDateString()}
==================================================
Thank you for using Talent-Hub Escrow Payments!
==================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${contractId}_${freelancer.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
