import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';

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

  loadReport() {
    this.isLoading = true;
    this.diaryService.getFreelancerDiaries().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.reportData = res.diaries.map((diary: any) => {
            const approvedPhases = (diary.phases || []).filter((p: any) => p.status === 'approved');
            const earned = approvedPhases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
            const budget = (diary.phases || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
            const totalPhases = (diary.phases || []).length;
            const completion = totalPhases > 0 ? Math.round((approvedPhases.length / totalPhases) * 100) : 0;

            let mappedStatus = 'In Progress';
            if (diary.overallStatus === 'completed') mappedStatus = 'Completed';
            else if (diary.overallStatus === 'cancelled') mappedStatus = 'Cancelled';

            return {
              title: diary.contractId?.contractTitle || 'Contract',
              client: diary.clientId?.registrationDetails?.fullName || 'Client',
              budget,
              earned,
              status: mappedStatus,
              type: diary.contractId?.budgetType || 'Fixed Price',
              startDate: diary.contractId?.contractStartDate || diary.createdAt,
              endDate: diary.contractId?.contractEndDate || diary.updatedAt,
              completion
            };
          });

          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load freelancer contract diaries:', err);
        this.isLoading = false;
      }
    });
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

  contactSupport() {
    this.router.navigate(['/user/contact-support']);
  }
}

