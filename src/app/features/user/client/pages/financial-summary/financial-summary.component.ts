import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Invoice {
  id: string;
  title: string;
  freelancer: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Processed';
  type: 'Hourly' | 'Fixed Price';
}

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class FinancialSummaryComponent implements OnInit {
  // Summary Stats
  totalBalance = 15750.00;
  totalSpent = 42300.00;
  upcomingPayments = 3250.00;

  // Search & Filter state
  searchQuery = '';
  statusFilter = 'All';

  // Interactive deposit modal state
  showDepositModal = false;
  depositAmount = 1000;
  depositMethod = 'card';
  isDepositing = false;

  // Rich Transaction Invoices Data
  invoices: Invoice[] = [
    {
      id: 'CON-802',
      title: 'Frontend Re-architecture & UI Modernization',
      freelancer: 'Sarah Connor',
      startDate: '2026-05-01',
      endDate: '2026-07-15',
      amount: 4500.00,
      status: 'Paid',
      type: 'Hourly'
    },
    {
      id: 'CON-405',
      title: 'Backend API Optimization',
      freelancer: 'Marcus Wright',
      startDate: '2026-04-01',
      endDate: '2026-06-10',
      amount: 1000.00,
      status: 'Processed',
      type: 'Fixed Price'
    },
    {
      id: 'CON-912',
      title: 'Mobile Banking App UI/UX Development',
      freelancer: 'John Connor',
      startDate: '2026-05-10',
      endDate: '2026-06-30',
      amount: 3250.00,
      status: 'Pending',
      type: 'Hourly'
    },
    {
      id: 'CON-104',
      title: 'AI Chatbot Integration & Agent Workflows',
      freelancer: 'Sarah Connor',
      startDate: '2026-05-12',
      endDate: '2026-08-12',
      amount: 1950.00,
      status: 'Processed',
      type: 'Fixed Price'
    },
    {
      id: 'CON-307',
      title: 'Cloud Infrastructure Migration & DevOps Setup',
      freelancer: 'T-800 Cyberdyne',
      startDate: '2026-04-15',
      endDate: '2026-07-15',
      amount: 5500.00,
      status: 'Paid',
      type: 'Fixed Price'
    }
  ];

  filteredInvoices: Invoice[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredInvoices = this.invoices.filter(inv => {
      const matchesSearch = inv.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            inv.freelancer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            inv.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || inv.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = 'All';
    this.applyFilters();
  }

  downloadInvoice(inv: Invoice) {
    console.log('Downloading invoice details for Contract ID:', inv.id);
    
    // Simulate immediate premium browser download toast
    const dummyBlob = new Blob([
      `TALENT HUB TRANSACTION INVOICE\n` +
      `=============================\n` +
      `Contract ID: ${inv.id}\n` +
      `Contract: ${inv.title}\n` +
      `Freelancer: ${inv.freelancer}\n` +
      `Project Period: ${inv.startDate} to ${inv.endDate}\n` +
      `Amount Paid: $${inv.amount.toFixed(2)}\n` +
      `Status: ${inv.status}\n` +
      `Date Generated: ${new Date().toLocaleDateString()}\n` +
      `=============================\n` +
      `Thank you for using Talent Hub!`
    ], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dummyBlob);
    link.download = `Invoice_${inv.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // Interactive Add Funds Dialog
  openDeposit() {
    this.showDepositModal = true;
    this.depositAmount = 2500;
  }

  closeDeposit() {
    this.showDepositModal = false;
  }

  processDeposit() {
    this.isDepositing = true;
    setTimeout(() => {
      this.totalBalance += this.depositAmount;
      this.isDepositing = false;
      this.closeDeposit();
    }, 1200);
  }
}
