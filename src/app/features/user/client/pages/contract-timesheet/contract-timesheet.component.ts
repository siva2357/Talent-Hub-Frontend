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

  // Map to store attendance logs by contract ID
  attendanceLogs: { [contractId: string]: any[] } = {};

  // For interactive logs modal
  selectedDayLogs: any = null;
  showLogsModal = false;

  ngOnInit(): void {
    this.loadTimesheets();
  }

  loadTimesheets(): void {
    this.isLoading = true;
    this.attendanceService.getClientTimesheets().subscribe({
      next: (res: any) => {
        if (res.success && res.contracts) {
          this.contracts = res.contracts;
          
          // Dynamically gather available months from all contracts' timesheets
          const monthsSet = new Set<string>();
          this.contracts.forEach(contract => {
            if (contract.timesheets) {
              contract.timesheets.forEach(ts => {
                if (ts.month) {
                  monthsSet.add(ts.month);
                }
              });
            }
          });
          
          if (monthsSet.size > 0) {
            this.availableMonths = Array.from(monthsSet);
            // Default to the first available month if selectedMonth is not set or not in availableMonths
            if (!this.selectedMonth || !this.availableMonths.includes(this.selectedMonth)) {
              this.selectedMonth = this.availableMonths[0];
            }
          } else {
            // Fallback default
            this.availableMonths = ['May 2026'];
            this.selectedMonth = 'May 2026';
          }

          if (this.contracts.length > 0) {
            this.expandedContractId = this.contracts[0].id;
            this.loadContractAttendanceLogs(this.expandedContractId);
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

  loadContractAttendanceLogs(contractId: string): void {
    if (this.attendanceLogs[contractId]) return; // Already loaded

    this.attendanceService.getAttendanceOverview(contractId).subscribe({
      next: (res: any) => {
        if (res.success && res.attendanceData) {
          this.attendanceLogs[contractId] = res.attendanceData;
        }
      },
      error: (err) => {
        console.error('Failed to load attendance logs for contract:', contractId, err);
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
    if (this.expandedContractId) {
      this.loadContractAttendanceLogs(this.expandedContractId);
    }
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value;
  }

  getFilteredTimesheets(timesheets: Timesheet[]) {
    return timesheets.filter(ts => ts.month === this.selectedMonth);
  }

  getAttendanceForDay(contractId: string, timesheetDay: any): any | null {
    const logsGroupedByMonth = this.attendanceLogs[contractId];
    if (!logsGroupedByMonth || !timesheetDay || !timesheetDay.date) return null;

    // Convert timesheetDay.date ("DD/MM/YYYY") to "YYYY-MM-DD"
    const parts = timesheetDay.date.split('/');
    if (parts.length !== 3) return null;
    const targetRawDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;

    for (const group of logsGroupedByMonth) {
      const found = group.logs.find((log: any) => log.rawDate === targetRawDate);
      if (found) return found;
    }
    return null;
  }

  viewDayLogs(contractId: string, dayData: any, dayName: string) {
    if (dayData.attendance === 'N/A' || dayData.hours === 0) return;
    const log = this.getAttendanceForDay(contractId, dayData);
    if (log) {
      this.selectedDayLogs = {
        dayName,
        date: log.date,
        totalHours: log.totalHours,
        sessions: log.sessions,
        status: log.status
      };
      this.showLogsModal = true;
    }
  }

  closeLogsModal() {
    this.showLogsModal = false;
    this.selectedDayLogs = null;
  }
}
