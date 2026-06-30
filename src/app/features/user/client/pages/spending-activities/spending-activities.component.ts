import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

import { CompletedContract } from '../../../../../core/model/client.model';

@Component({
  selector: 'app-spending-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spending-activities.component.html',
  styleUrl: './spending-activities.component.css'
})
export class SpendingActivitiesComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private diaryService = inject(ContractDiaryService);

  contracts: CompletedContract[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadCompletedContracts();
  }

  loadCompletedContracts() {
    this.isLoading = true;
    this.diaryService.getClientDiaries().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.contracts = res.diaries.map((diary: any) => {
            const budget = (diary.phases || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || diary.contractId?.estimatedBudget || 0;
            const totalPaid = (diary.phases || [])
              .filter((p: any) => p.status === 'approved')
              .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

            let mappedStatus = 'In Progress';
            if (diary.overallStatus === 'completed') {
              mappedStatus = 'Paid';
            } else if (diary.overallStatus === 'in-progress') {
              mappedStatus = 'Processed';
            }

            return {
              contractId: diary.contractId?._id || diary._id,
              title: diary.contractId?.contractTitle || 'Contract',
              type: diary.contractId?.budgetType || 'Fixed Price',
              freelancer: diary.freelancerId?.registrationDetails?.fullName || 'Freelancer',
              startDate: diary.contractId?.contractStartDate || diary.createdAt,
              endDate: diary.contractId?.contractEndDate || diary.updatedAt,
              budget,
              totalPaid,
              status: mappedStatus
            };
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load diaries:', err);
        this.isLoading = false;
      }
    });
  }

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
