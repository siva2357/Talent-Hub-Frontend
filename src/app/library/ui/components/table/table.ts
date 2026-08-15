import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  headerName: string;
  type?: 'text' | 'badge' | 'actions';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  // Dynamic Inputs allows this component to be reused anywhere
  @Input() columns: TableColumn[] = [
    { field: 'name', headerName: 'Employee Name', type: 'text' },
    { field: 'role', headerName: 'Role', type: 'text' },
    { field: 'department', headerName: 'Department', type: 'text' },
    { field: 'status', headerName: 'Status', type: 'badge' },
    { field: 'actions', headerName: 'Actions', type: 'actions' }
  ];

  @Input() data: any[] = [
    { name: 'Sarah Smith', role: 'Software Engineer', status: 'Active', department: 'Engineering' },
    { name: 'Michael Chen', role: 'Product Manager', status: 'On Leave', department: 'Product' },
    { name: 'Emily Davis', role: 'UX Designer', status: 'Active', department: 'Design' },
    { name: 'James Wilson', role: 'Data Analyst', status: 'Active', department: 'Data Science' },
    { name: 'Jessica Taylor', role: 'HR Business Partner', status: 'Inactive', department: 'Human Resources' }
  ];
}
