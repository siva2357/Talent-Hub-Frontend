import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../../../core/services/attendance.service';

interface TimesheetDay {
  date: string;
  hours: number;
  attendance: 'Present' | 'Partial' | 'Absent' | 'Pending' | 'N/A';
  faceMatch: boolean;
}

interface Timesheet {
  id: string;
  week: string;
  month: string;
  mon: TimesheetDay;
  tue: TimesheetDay;
  wed: TimesheetDay;
  thu: TimesheetDay;
  fri: TimesheetDay;
  sat: TimesheetDay;
  sun: TimesheetDay;
  total: number;
  status: string;
}

interface Contract {
  id: string;
  title: string;
  freelancer: string;
  budget: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
  status: string;
  timesheets: Timesheet[];
}

@Component({
  selector: 'app-contract-timesheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-timesheet.component.html',
  styleUrl: './contract-timesheet.component.css'
})
export class ContractTimesheetComponent implements OnInit {
  private attendanceService = inject(AttendanceService);

  expandedContractId: string | null = null;
  selectedMonth: string = 'May 2026';
  availableMonths: string[] = ['April 2026', 'May 2026'];
  contracts: Contract[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadTimesheets();
  }

  loadTimesheets(): void {
    this.isLoading = true;
    this.attendanceService.getClientTimesheets().subscribe({
      next: (res: any) => {
        if (res.success && res.contracts) {
          this.contracts = res.contracts;
          if (this.contracts.length > 0) {
            this.expandedContractId = this.contracts[0].id;
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load client timesheets:', err);
        this.isLoading = false;
      }
    });
  }

  approveTimesheet(timesheetId: string): void {
    this.attendanceService.approveTimesheet(timesheetId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.loadTimesheets();
        }
      },
      error: (err) => {
        console.error('Failed to approve timesheet:', err);
      }
    });
  }

  toggleContract(id: string) {
    this.expandedContractId = this.expandedContractId === id ? null : id;
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value;
  }

  getFilteredTimesheets(timesheets: Timesheet[]) {
    return timesheets.filter(ts => ts.month === this.selectedMonth);
  }
}
