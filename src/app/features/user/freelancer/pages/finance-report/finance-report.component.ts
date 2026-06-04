import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';

@Component({
  selector: 'app-finance-report',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ChipComponent, InputComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './finance-report.component.html',
  styleUrl: './finance-report.component.css'
})
export class FinanceReportComponent implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private financeService = inject(FinanceService);
  private diaryService = inject(ContractDiaryService);

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
    { label: 'Hourly', value: 'Hourly' }
  ];

  // Active Filter Chips
  activeFilters: { key: string, label: string, value: string }[] = [];

  // Summary Stats for the report
  amountReceived = 0;
  amountPending = 0;

  // Detailed Report Data
  reportData: any[] = [];
  filteredData: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadStats();
    this.loadReport();
  }

  loadStats() {
    this.financeService.getStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.amountReceived = res.stats.totalEarnings || 0;
          this.amountPending = res.stats.balanceLeft || 0;
        }
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
      }
    });
  }

  selectedWithdrawItem: any = null;
  showWithdrawModal: boolean = false;
  agreeToTerms: boolean = false;

  loadReport() {
    this.isLoading = true;
    this.diaryService.getFreelancerDiaries().subscribe({
      next: (resDiaries: any) => {
        if (resDiaries.success && resDiaries.diaries) {
          this.financeService.getTransactions().subscribe({
            next: (resTxns: any) => {
              const txns = resTxns.success ? resTxns.transactions : [];

              this.reportData = resDiaries.diaries.map((diary: any) => {
                const contractId = diary.contractId?._id;

                // Filter transactions associated with this contract
                const contractTxns = txns.filter((t: any) => t.contractId && (t.contractId._id === contractId || t.contractId === contractId));

                const receivedAmount = contractTxns
                  .filter((t: any) => t.type === 'Payment Released')
                  .reduce((sum: number, t: any) => sum + t.amount, 0);

                const withdrawnAmount = contractTxns
                  .filter((t: any) => t.type === 'Withdrawal')
                  .reduce((sum: number, t: any) => sum + t.amount, 0);

                const balance = Math.max(0, receivedAmount - withdrawnAmount);

                const approvedPhases = (diary.phases || []).filter((p: any) => p.status === 'approved');
                const earned = approvedPhases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
                const budget = (diary.phases || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
                const totalPhases = (diary.phases || []).length;
                const completion = totalPhases > 0 ? Math.round((approvedPhases.length / totalPhases) * 100) : 0;

                let mappedStatus = 'In Progress';
                if (diary.overallStatus === 'completed') mappedStatus = 'Completed';
                else if (diary.overallStatus === 'cancelled') mappedStatus = 'Cancelled';

                return {
                  contractId,
                  title: diary.contractId?.contractTitle || 'Contract',
                  client: diary.clientId?.registrationDetails?.fullName || 'Client',
                  budget,
                  earned,
                  status: mappedStatus,
                  type: diary.contractId?.budgetType || 'Fixed Price',
                  startDate: diary.contractId?.contractStartDate || diary.createdAt,
                  endDate: diary.contractId?.contractEndDate || diary.updatedAt,
                  completion,
                  balance,
                  withdrawnAmount,
                  receivedAmount
                };
              });

              this.applyFilters();
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Failed to load transactions for report mapping:', err);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load freelancer contract diaries:', err);
        this.isLoading = false;
      }
    });
  }

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
    if (this.selectedWithdrawItem && this.agreeToTerms) {
      const amount = this.selectedWithdrawItem.balance;
      const contractId = this.selectedWithdrawItem.contractId;

      this.financeService.withdraw(amount, contractId).subscribe({
        next: (res: any) => {
          if (res.success) {
            alert(`Withdrawal request for $${amount.toFixed(2)} processed successfully!`);
            this.loadStats();
            this.loadReport();
            this.closeModal();
          }
        },
        error: (err) => {
          alert('Withdrawal request failed: ' + (err.error?.message || 'Error occurred'));
        }
      });
    }
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
    
    let reportContent = `TALENT HUB FINANCIAL STATEMENT\n`;
    reportContent += `=============================\n`;
    reportContent += `Amount Received : $${this.amountReceived.toFixed(2)}\n`;
    reportContent += `Amount Pending  : $${this.amountPending.toFixed(2)}\n`;
    reportContent += `=============================\n\n`;
    reportContent += `Contract details breakdown:\n`;
    
    this.filteredData.forEach(item => {
      reportContent += `-----------------------------\n`;
      reportContent += `Title      : ${item.title}\n`;
      reportContent += `Client     : ${item.client}\n`;
      reportContent += `Budget     : $${item.budget.toFixed(2)}\n`;
      reportContent += `Earned     : $${item.earned.toFixed(2)}\n`;
      reportContent += `Status     : ${item.status}\n`;
      reportContent += `Type       : ${item.type}\n`;
      reportContent += `Completion : ${item.completion}%\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Financial_Statement_Report.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  downloadPaymentStatement(item: any) {
    if (item.contractId) {
      window.open(this.financeService.getPaymentStatementPdfUrl(item.contractId), '_blank');
    } else {
      alert('Contract ID not found.');
    }
  }

  contactSupport() {
    this.router.navigate(['/user/contact-support']);
  }
}

