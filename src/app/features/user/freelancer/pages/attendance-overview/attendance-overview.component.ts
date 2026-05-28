import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ApplicationService } from '../../../../../core/services/application.service';
import { AttendanceService } from '../../../../../core/services/attendance.service';

@Component({
  selector: 'app-attendance-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './attendance-overview.component.html',
  styleUrl: './attendance-overview.component.css'
})
export class AttendanceOverviewComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private attendanceService = inject(AttendanceService);
  private cdr = inject(ChangeDetectorRef);

  expandedIndex: number | null = 0;
  isEvidenceModalOpen = false;
  selectedLog: any = null;

  activeContracts: any[] = [];
  selectedContractId: string = '';
  attendanceData: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchActiveContracts();
  }

  fetchActiveContracts(): void {
    this.isLoading = true;
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        if (res.success && res.offers) {
          this.activeContracts = res.offers.filter((o: any) => o.status === 'Accepted');
          if (this.activeContracts.length > 0) {
            const savedId = this.attendanceService.activeContractId;
            const resolveId = (c: any) => c.contractId || c.id || c._id;
            this.selectedContractId = savedId && this.activeContracts.some(c => resolveId(c) === savedId)
              ? savedId 
              : resolveId(this.activeContracts[0]);
            
            this.onContractChange(this.selectedContractId);
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch active contracts:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onContractChange(contractId: string): void {
    this.selectedContractId = contractId;
    this.attendanceService.activeContractId = contractId;
    this.loadOverview();
    this.cdr.detectChanges();
  }

  loadOverview(): void {
    if (!this.selectedContractId) return;

    this.isLoading = true;
    this.attendanceService.getAttendanceOverview(this.selectedContractId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.attendanceData = res.attendanceData || [];
          this.expandedIndex = this.attendanceData.length > 0 ? 0 : null;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load attendance overview:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleAccordion(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    this.cdr.detectChanges();
  }

  showEvidence(log: any) {
    this.selectedLog = log;
    this.isEvidenceModalOpen = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.isEvidenceModalOpen = false;
    this.selectedLog = null;
    this.cdr.detectChanges();
  }

  getBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'attended': return 'badge-success';
      case 'partially attended': return 'badge-warning';
      case 'absent': return 'badge-danger';
      case 'completed': return 'badge-success';
      case 'in progress': return 'badge-info';
      case 'active': return 'badge-primary';
      default: return 'badge-secondary';
    }
  }
}
