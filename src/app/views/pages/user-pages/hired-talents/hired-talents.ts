import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-hired-talents',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hired-talents.html',
  styleUrl: './hired-talents.css',
})
export class HiredTalents {

selectedJob:any = null;
isEditMode = false;


selectJob(job:any){
  this.isEditMode = true;
  this.selectedJob = { ...job };
}

candidates = [
{ id:1, fullName:'Rahul Sharma', jobId:'JOB-001', jobTitle:'Angular Developer', jobType:'Full Time', category:'Frontend', offerStatus:'Accepted' },
{ id:2, fullName:'Priya Verma', jobId:'JOB-002', jobTitle:'Node.js Backend Developer', jobType:'Full Time', category:'Backend', offerStatus:'Pending' },
{ id:3, fullName:'Amit Patel', jobId:'JOB-003', jobTitle:'React Frontend Engineer', jobType:'Contract', category:'Frontend', offerStatus:'Accepted' },
{ id:4, fullName:'Sneha Reddy', jobId:'JOB-004', jobTitle:'Full Stack Developer', jobType:'Full Time', category:'Full Stack', offerStatus:'Pending' },
{ id:5, fullName:'Karan Mehta', jobId:'JOB-005', jobTitle:'Python Data Analyst', jobType:'Part Time', category:'Data Science', offerStatus:'Accepted' },
{ id:6, fullName:'Anjali Gupta', jobId:'JOB-006', jobTitle:'DevOps Engineer', jobType:'Full Time', category:'Backend', offerStatus:'Rejected' },
{ id:7, fullName:'Rohit Kumar', jobId:'JOB-007', jobTitle:'UI/UX Designer', jobType:'Contract', category:'Design', offerStatus:'Pending' },
{ id:8, fullName:'Neha Singh', jobId:'JOB-008', jobTitle:'Machine Learning Engineer', jobType:'Full Time', category:'Data Science', offerStatus:'Accepted' },
{ id:9, fullName:'Arjun Nair', jobId:'JOB-009', jobTitle:'Cloud Engineer', jobType:'Full Time', category:'Backend', offerStatus:'Pending' },
{ id:10, fullName:'Pooja Kulkarni', jobId:'JOB-010', jobTitle:'Java Backend Developer', jobType:'Internship', category:'Backend', offerStatus:'Accepted' }
];


}
