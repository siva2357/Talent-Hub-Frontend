import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'Completed' | 'In Progress' | 'Review' | 'Pending' | 'Rejected';
  invoiceId?: string;
}

export interface ContractTransactions {
  contractId: string;
  title: string;
  freelancer: string;
  type: 'Hourly' | 'Fixed Price';
  budget: number;
  totalTransacted: number;
  currentPhase: 'Funded' | 'In Progress' | 'Review' | 'Released' | 'Rejected';
  milestones: Milestone[];
}

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  searchQuery = '';
  typeFilter = 'All';
  expandedContractId: string | null = 'CON-802';

  contracts: ContractTransactions[] = [
    {
      contractId: 'CON-802',
      title: 'Frontend Re-architecture & UI Modernization',
      freelancer: 'Sarah Connor',
      type: 'Hourly',
      budget: 10000.00,
      totalTransacted: 6250.00,
      currentPhase: 'In Progress',
      milestones: [
        { id: 'M-101', title: 'Project Discovery & Design System', date: '2026-04-10', amount: 2500.00, status: 'Completed', invoiceId: 'TXN-101' },
        { id: 'M-102', title: 'Core Component Migration', date: '2026-04-28', amount: 3750.00, status: 'Completed', invoiceId: 'TXN-106' },
        { id: 'M-103', title: 'State Management Refactor', date: '2026-05-15', amount: 2250.00, status: 'In Progress' },
        { id: 'M-104', title: 'Testing & Final Polish', date: '2026-06-10', amount: 1500.00, status: 'Pending' }
      ]
    },
    {
      contractId: 'CON-405',
      title: 'Backend API Optimization',
      freelancer: 'Marcus Wright',
      type: 'Fixed Price',
      budget: 2500.00,
      totalTransacted: 1000.00,
      currentPhase: 'Review',
      milestones: [
        { id: 'M-201', title: 'Database Schema Optimization', date: '2026-05-01', amount: 1000.00, status: 'Completed', invoiceId: 'TXN-103' },
        { id: 'M-202', title: 'REST API Core Completion', date: '2026-05-20', amount: 1500.00, status: 'Review' }
      ]
    },
    {
      contractId: 'CON-912',
      title: 'Mobile Banking App UI/UX Development',
      freelancer: 'John Connor',
      type: 'Hourly',
      budget: 6000.00,
      totalTransacted: 2000.00,
      currentPhase: 'Review',
      milestones: [
        { id: 'M-301', title: 'High-Fidelity Wireframes', date: '2026-05-05', amount: 2000.00, status: 'Completed', invoiceId: 'TXN-104' },
        { id: 'M-302', title: 'Flutter Core Interface Setup', date: '2026-05-25', amount: 4000.00, status: 'Review' }
      ]
    },
    {
      contractId: 'CON-104',
      title: 'AI Chatbot Integration & Agent Workflows',
      freelancer: 'Sarah Connor',
      type: 'Fixed Price',
      budget: 3000.00,
      totalTransacted: 0.00,
      currentPhase: 'Funded',
      milestones: [
        { id: 'M-401', title: 'NLP Model Setup & Fine-tuning', date: '2026-06-01', amount: 3000.00, status: 'Pending' }
      ]
    },
    {
      contractId: 'CON-307',
      title: 'Cloud Infrastructure Migration & DevOps Setup',
      freelancer: 'T-800 Cyberdyne',
      type: 'Fixed Price',
      budget: 8000.00,
      totalTransacted: 4000.00,
      currentPhase: 'Rejected',
      milestones: [
        { id: 'M-501', title: 'AWS Infrastructure Setup', date: '2026-04-15', amount: 4000.00, status: 'Completed', invoiceId: 'TXN-107' },
        { id: 'M-502', title: 'CI/CD Pipeline Automation', date: '2026-04-25', amount: 4000.00, status: 'Rejected' }
      ]
    }
  ];

  filteredContracts: ContractTransactions[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredContracts = this.contracts.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.contractId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.freelancer.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesType = this.typeFilter === 'All' || c.type === this.typeFilter;

      return matchesSearch && matchesType;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.typeFilter = 'All';
    this.applyFilters();
  }

  toggleContract(contractId: string) {
    if (this.expandedContractId === contractId) {
      this.expandedContractId = null;
    } else {
      this.expandedContractId = contractId;
    }
  }

  // Locates the first active milestone (In Progress, Review, Rejected, or Pending) to trigger quick payment from header
  getActiveMilestone(c: ContractTransactions): Milestone | undefined {
    return c.milestones.find(m => m.status === 'In Progress' || m.status === 'Review' || m.status === 'Rejected') || 
           c.milestones.find(m => m.status === 'Pending');
  }

  // Locates the latest completed milestone to download invoice
  getLatestCompletedMilestone(c: ContractTransactions): Milestone | undefined {
    // Traverse backwards to find completed milestones
    for (let i = c.milestones.length - 1; i >= 0; i--) {
      if (c.milestones[i].status === 'Completed') {
        return c.milestones[i];
      }
    }
    return undefined;
  }

  releaseMilestonePayment(c: ContractTransactions, m: Milestone) {
    if (m.status === 'Completed') {
      alert('This milestone payment has already been released!');
      return;
    }

    const confirmRelease = confirm(`Are you sure you want to release the escrow payment of $${m.amount.toLocaleString('en-US', {minimumFractionDigits: 2})} for milestone: "${m.title}"?`);
    if (!confirmRelease) return;

    // Release funds
    m.status = 'Completed';
    c.totalTransacted += m.amount;
    const generatedTxnId = `TXN-${Math.floor(100 + Math.random() * 900)}`;
    m.invoiceId = generatedTxnId;

    // Check if there are other pending or active milestones to adjust contract overall phase
    const hasActiveOrReview = c.milestones.some(milestone => milestone.status === 'In Progress' || milestone.status === 'Review');
    const hasRejected = c.milestones.some(milestone => milestone.status === 'Rejected');

    if (!hasActiveOrReview && !hasRejected) {
      const allCompleted = c.milestones.every(milestone => milestone.status === 'Completed');
      if (allCompleted) {
        c.currentPhase = 'Released';
      }
    } else if (hasRejected) {
      c.currentPhase = 'Rejected';
    } else {
      c.currentPhase = 'In Progress';
    }

    alert(`Successfully released payment of $${m.amount.toLocaleString('en-US', {minimumFractionDigits: 2})} for Milestone: "${m.title}"!\nInvoice reference created: ${generatedTxnId}`);
  }

  downloadMilestoneReceipt(c: ContractTransactions, m: Milestone) {
    if (!m.invoiceId) {
      alert('Invoice not available for incomplete milestones.');
      return;
    }

    console.log('Downloading invoice for milestone:', m.id);
    
    const receiptContent = new Blob([
      `TALENT HUB TRANSACTION RECEIPT\n` +
      `=============================\n` +
      `Invoice ID: ${m.invoiceId}\n` +
      `Milestone Reference: ${m.id}\n` +
      `Contract: ${c.title} (${c.contractId})\n` +
      `Milestone Title: ${m.title}\n` +
      `Date Completed: ${new Date(m.date).toLocaleDateString()}\n` +
      `Freelancer: ${c.freelancer}\n` +
      `Amount Released: $${m.amount.toFixed(2)}\n` +
      `Status: Released / Completed\n` +
      `=============================\n` +
      `Thank you for trusting Talent Hub!`
    ], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(receiptContent);
    link.download = `Invoice_${m.invoiceId}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
