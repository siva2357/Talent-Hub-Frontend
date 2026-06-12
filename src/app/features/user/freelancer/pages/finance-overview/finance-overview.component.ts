import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';

@Component({
  selector: 'app-finance-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './finance-overview.component.html',
  styleUrl: './finance-overview.component.css'
})
export class FinanceOverviewComponent implements OnInit {
  private router = inject(Router);
  private financeService = inject(FinanceService);
  private diaryService = inject(ContractDiaryService);

  // Financial Stats
  totalEarnings = 0;
  amountWithdrawn = 0;
  balanceLeft = 0;
  platformFeesDeducted = 0;

  contracts: any[] = [];
  selectedContract: any = null;
  isLoading = true;

  ngOnInit() {
    this.loadStats();
    this.loadContracts();
  }

  loadStats() {
    this.financeService.getStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.totalEarnings = res.stats.totalEarnings || 0;
          this.amountWithdrawn = res.stats.amountWithdrawn || 0;
          this.balanceLeft = res.stats.balanceLeft || 0;
          this.platformFeesDeducted = res.stats.platformFeesDeducted || 0;
        }
      },
      error: (err) => {
        console.error('Failed to load freelancer stats:', err);
      }
    });
  }

  loadContracts() {
    this.isLoading = true;
    this.diaryService.getFreelancerDiaries().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.contracts = res.diaries.map((diary: any) => {
            const approvedPhases = (diary.phases || []).filter((p: any) => p.status === 'approved');
            const totalEarned = approvedPhases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
            
            // Find latest payment date
            let lastPaymentDate = '-';
            if (approvedPhases.length > 0) {
              const sorted = approvedPhases.sort((a: any, b: any) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime());
              lastPaymentDate = new Date(sorted[0].approvedAt).toLocaleDateString();
            }

            const mappedPhases = (diary.phases || []).map((p: any) => {
              let mappedStatus = 'Pending';
              if (p.status === 'approved') mappedStatus = 'Paid';
              else if (p.status === 'submitted') mappedStatus = 'In Review';
              else if (p.status === 'changes-requested') mappedStatus = 'Changes Requested';
              else if (p.status === 'in-progress') mappedStatus = 'In Progress';

              return {
                name: p.name,
                amount: p.amount || 0,
                status: mappedStatus,
                date: p.approvedAt ? new Date(p.approvedAt).toLocaleDateString() : '-'
              };
            });

            let mappedStatus = 'Ongoing';
            if (diary.overallStatus === 'completed') mappedStatus = 'Completed';
            else if (diary.overallStatus === 'cancelled') mappedStatus = 'Cancelled';

            return {
              title: diary.contractId?.contractTitle || 'Contract',
              client: diary.clientId?.registrationDetails?.fullName || 'Client',
              totalEarned,
              lastPaymentDate,
              status: mappedStatus,
              type: diary.contractId?.budgetType || 'Fixed Price',
              phases: mappedPhases
            };
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load freelancer contract details:', err);
        this.isLoading = false;
      }
    });
  }

  toggleContractDetails(contract: any) {
    this.selectedContract = this.selectedContract === contract ? null : contract;
  }

  viewStatements() {
    this.router.navigate(['/user/finance-report']);
  }

  viewAllTransactions() {
    this.router.navigate(['/user/finance-report']);
  }

  withdraw() {
    this.router.navigate(['/user/finance-report']);
  }
}
