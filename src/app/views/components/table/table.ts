import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {

  jobs = [
    { id:1,jobId:'JOB-001', title:'Angular Developer', category:'Frontend', type:'Full Time', location:'Hyderabad', applicants:24, status:'Open'},
    { id:2,jobId:'JOB-002', title:'Node.js Backend Developer', category:'Backend', type:'Full Time', location:'Bangalore', applicants:10, status:'Open'},
    { id:3,jobId:'JOB-003', title:'React Frontend Engineer', category:'Frontend', type:'Contract', location:'Pune', applicants:6, status:'Open'},
    { id:4,jobId:'JOB-004', title:'Full Stack Developer', category:'Full Stack', type:'Full Time', location:'Chennai', applicants:14, status:'Open'},
    { id:5,jobId:'JOB-005', title:'Python Data Analyst', category:'Data Science', type:'Part Time', location:'Remote', applicants:7, status:'Open'},
    { id:6,jobId:'JOB-006', title:'DevOps Engineer', category:'Backend', type:'Full Time', location:'Delhi', applicants:3, status:'Closed'},
    { id:7,jobId:'JOB-007', title:'UI/UX Designer', category:'Design', type:'Contract', location:'Mumbai', applicants:11, status:'Open'},
    { id:8,jobId:'JOB-008', title:'Machine Learning Engineer', category:'Data Science', type:'Full Time', location:'Hyderabad', applicants:18, status:'Open'},
    { id:9,jobId:'JOB-009', title:'Cloud Engineer', category:'Backend', type:'Full Time', location:'Bangalore', applicants:9, status:'Open'},
    { id:10,jobId:'JOB-010', title:'Java Backend Developer', category:'Backend', type:'Internship', location:'Pune', applicants:4, status:'Closed'}
  ];

}
