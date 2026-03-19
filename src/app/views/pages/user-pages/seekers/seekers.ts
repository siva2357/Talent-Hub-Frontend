import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Buttons } from '../../../components/buttons/buttons';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";

@Component({
  selector: 'app-seekers',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, Buttons, Table, Pagination],

  templateUrl: './seekers.html',
  styleUrl: './seekers.css',
})
export class Seekers implements OnInit{

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  @ViewChild('imageTemplate', { static: true })
  public imageTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  columns: any[] = [];

  page = 1;
limit = 5;
total = 0;

paginatedJobSeekers: any[] = [];

    constructor() {}

  ngOnInit() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Profile', template: this.imageTemplateRef },
      { name: 'Full Name', prop: 'name' },
      { name: 'Email', prop: 'email' },
      { name: 'Phone', prop: 'phone' },
      { name: 'Company', prop: 'company' },
      { name: 'Position', prop: 'position' },
      { name: 'Status', template: this.statusTemplateRef },
      { name: 'Action', template: this.actionsTemplateRef, center: true },
    ];
          this.total = this.seekers.length;
  this.applyPagination();

  }


  applyPagination() {
  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedJobSeekers = this.seekers.slice(start, end);
}

onPageChange(p: number) {
  this.page = p;
  this.applyPagination();
}

onLimitChange(l: number) {
  this.limit = l;
  this.page = 1;
  this.applyPagination();
}



    seekers = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@technova.com',
      phone: '9876543210',
      company: 'TechNova Pvt Ltd',
      position: 'HR Manager',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=1',
    },
    {
      id: 2,
      name: 'Anita Verma',
      email: 'anita@globalhire.com',
      phone: '9123456780',
      company: 'GlobalHire Solutions',
      position: 'Talent Acquisition Lead',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=2',
    },
    {
      id: 3,
      name: 'Vikram Singh',
      email: 'vikram@hirebridge.com',
      phone: '9988776655',
      company: 'HireBridge',
      position: 'Senior Recruiter',
      status: 'Inactive',
      image: 'https://i.pravatar.cc/40?img=3',
    },
    {
      id: 4,
      name: 'Priya Reddy',
      email: 'priya@talentcore.com',
      phone: '9012345678',
      company: 'TalentCore',
      position: 'HR Executive',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=4',
    },
    {
      id: 5,
      name: 'Arjun Mehta',
      email: 'arjun@nextgenhire.com',
      phone: '9988123456',
      company: 'NextGen Hire',
      position: 'Recruitment Lead',
      status: 'Blocked',
      image: 'https://i.pravatar.cc/40?img=5',
    },
    {
      id: 6,
      name: 'Sneha Kapoor',
      email: 'sneha@brightjobs.com',
      phone: '9870012345',
      company: 'BrightJobs',
      position: 'HR Manager',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=6',
    },
    {
      id: 7,
      name: 'Rohit Gupta',
      email: 'rohit@hirehub.com',
      phone: '9123009876',
      company: 'HireHub',
      position: 'Talent Specialist',
      status: 'Inactive',
      image: 'https://i.pravatar.cc/40?img=7',
    },
    {
      id: 8,
      name: 'Neha Joshi',
      email: 'neha@workforcepro.com',
      phone: '9001122334',
      company: 'Workforce Pro',
      position: 'HR Consultant',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=8',
    },
    {
      id: 9,
      name: 'Karan Malhotra',
      email: 'karan@talentbridge.com',
      phone: '9887766554',
      company: 'TalentBridge',
      position: 'Senior Recruiter',
      status: 'Blocked',
      image: 'https://i.pravatar.cc/40?img=9',
    },
    {
      id: 10,
      name: 'Pooja Nair',
      email: 'pooja@hrconnect.com',
      phone: '9765432109',
      company: 'HR Connect',
      position: 'HR Executive',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=10',
    },
    {
      id: 11,
      name: 'Manish Yadav',
      email: 'manish@jobflow.com',
      phone: '9898989898',
      company: 'JobFlow',
      position: 'Recruitment Manager',
      status: 'Inactive',
      image: 'https://i.pravatar.cc/40?img=11',
    },
    {
      id: 12,
      name: 'Divya Iyer',
      email: 'divya@peoplefirst.com',
      phone: '9876540001',
      company: 'PeopleFirst',
      position: 'HR Lead',
      status: 'Active',
      image: 'https://i.pravatar.cc/40?img=12',
    },
  ];

  onView(r: any) {
    console.log('View', r);
  }

  onBlock(r: any) {
    console.log('Block', r);
  }

  onUnblock(r: any) {
    console.log('Unblock', r);
  }

  onDeactivate(r: any) {
    console.log('Deactivate', r);
  }


}
