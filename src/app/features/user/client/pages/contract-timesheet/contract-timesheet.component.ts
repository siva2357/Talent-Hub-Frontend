import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimesheetDay {
  date: string;
  hours: number;
  attendance: 'Present' | 'Partial' | 'Absent' | 'Pending' | 'N/A';
  faceMatch: boolean;
}

interface Timesheet {
  id: number;
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
  id: number;
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
export class ContractTimesheetComponent {
  expandedContractId: number | null = 1;

  // Filter state
  selectedMonth: string = 'May 2026';
  availableMonths: string[] = ['April 2026', 'May 2026'];

  contracts: Contract[] = [
    {
      id: 1,
      title: 'Frontend Re-architecture & UI Modernization',
      freelancer: 'Elena Rodriguez',
      budget: 8500,
      spent: 4500,
      remaining: 4000,
      startDate: 'May 01, 2026',
      endDate: 'Jul 15, 2026',
      status: 'Active',
      timesheets: [
        {
          id: 1, week: 'May 25 - May 31, 2026', month: 'May 2026', total: 0, status: 'Pending Approval',
          mon: { date: '25/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          tue: { date: '26/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          wed: { date: '27/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          thu: { date: '28/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          fri: { date: '29/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          sat: { date: '30/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          sun: { date: '31/05/2026', hours: 0, attendance: 'Pending', faceMatch: false }
        },
        {
          id: 2, week: 'May 18 - May 24, 2026', month: 'May 2026', total: 8, status: 'Pending Approval',
          mon: { date: '18/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          tue: { date: '19/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          wed: { date: '20/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          thu: { date: '21/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          fri: { date: '22/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          sat: { date: '23/05/2026', hours: 0, attendance: 'Pending', faceMatch: false },
          sun: { date: '24/05/2026', hours: 0, attendance: 'Pending', faceMatch: false }
        },
        {
          id: 3, week: 'May 11 - May 17, 2026', month: 'May 2026', total: 38, status: 'Approved',
          mon: { date: '11/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          tue: { date: '12/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          wed: { date: '13/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          thu: { date: '14/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          fri: { date: '15/05/2026', hours: 6, attendance: 'Partial', faceMatch: false },
          sat: { date: '16/05/2026', hours: 0, attendance: 'Absent', faceMatch: false },
          sun: { date: '17/05/2026', hours: 0, attendance: 'Absent', faceMatch: false }
        },
        {
          id: 4, week: 'May 04 - May 10, 2026', month: 'May 2026', total: 32, status: 'Approved',
          mon: { date: '04/05/2026', hours: 0, attendance: 'Absent', faceMatch: false },
          tue: { date: '05/05/2026', hours: 8, attendance: 'Present', faceMatch: false },
          wed: { date: '06/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          thu: { date: '07/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          fri: { date: '08/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          sat: { date: '09/05/2026', hours: 0, attendance: 'Absent', faceMatch: false },
          sun: { date: '10/05/2026', hours: 0, attendance: 'Absent', faceMatch: false }
        },
        {
          id: 5, week: 'May 01 - May 03, 2026', month: 'May 2026', total: 8, status: 'Approved',
          mon: { date: '27/04/2026', hours: 0, attendance: 'N/A', faceMatch: false },
          tue: { date: '28/04/2026', hours: 0, attendance: 'N/A', faceMatch: false },
          wed: { date: '29/04/2026', hours: 0, attendance: 'N/A', faceMatch: false },
          thu: { date: '30/04/2026', hours: 0, attendance: 'N/A', faceMatch: false },
          fri: { date: '01/05/2026', hours: 8, attendance: 'Present', faceMatch: true },
          sat: { date: '02/05/2026', hours: 0, attendance: 'Absent', faceMatch: false },
          sun: { date: '03/05/2026', hours: 0, attendance: 'Absent', faceMatch: false }
        }
      ]
    },
    {
      id: 2,
      title: 'Backend API Optimization',
      freelancer: 'James Wilson',
      budget: 5000,
      spent: 1000,
      remaining: 4000,
      startDate: 'Apr 01, 2026',
      endDate: 'Jun 10, 2026',
      status: 'Active',
      timesheets: [
        {
          id: 6, week: 'Apr 20 - Apr 26, 2026', month: 'April 2026', total: 20, status: 'Pending Approval',
          mon: { date: '20/04/2026', hours: 4, attendance: 'Partial', faceMatch: true },
          tue: { date: '21/04/2026', hours: 4, attendance: 'Partial', faceMatch: true },
          wed: { date: '22/04/2026', hours: 4, attendance: 'Partial', faceMatch: true },
          thu: { date: '23/04/2026', hours: 4, attendance: 'Partial', faceMatch: true },
          fri: { date: '24/04/2026', hours: 4, attendance: 'Partial', faceMatch: true },
          sat: { date: '25/04/2026', hours: 0, attendance: 'Absent', faceMatch: false },
          sun: { date: '26/04/2026', hours: 0, attendance: 'Absent', faceMatch: false }
        }
      ]
    }
  ];

  toggleContract(id: number) {
    this.expandedContractId = this.expandedContractId === id ? null : id;
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value;
  }

  getFilteredTimesheets(timesheets: Timesheet[]) {
    return timesheets.filter(ts => ts.month === this.selectedMonth);
  }
}
