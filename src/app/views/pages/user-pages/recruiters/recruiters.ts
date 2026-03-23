import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table } from '../../../components/table/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Buttons } from '../../../components/buttons/buttons';
import { Pagination } from "../../../components/pagination/pagination";
import { AdminService } from '../../../../core/services/admin-service';

@Component({
  selector: 'app-recruiters',
  standalone: true,
  templateUrl: './recruiters.html',
  styleUrl: './recruiters.css',
  imports: [Table, FormsModule, ReactiveFormsModule, CommonModule, Buttons, Pagination],
})
export class Recruiters implements OnInit {

  searchText = '';
selectedCompany = '';
selectedPosition = '';
selectedStatus = '';

filteredRecruiters: any[] = [];
isFiltering = false;

companies = ['TechNova','GlobalHire','HireBridge'];
positions = ['HR Manager','Recruiter','Hiring Manager'];
statuses = ['Active', 'Inactive', 'Blocked'];
recruiters:any[] =[]


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

paginatedRecruiters: any[] = [];

  constructor(private adminService:AdminService) {}

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

      this.total = this.recruiters.length;
  this.applyPagination();
  this.recruiterList()

  }

applyPagination() {
  const source = this.isFiltering ? this.filteredRecruiters : this.recruiters;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedRecruiters = source.slice(start, end);
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


recruiterList() {
  this.adminService.getAllRecruiters().subscribe({
    next: (res: any) => {
      this.recruiters = res.recruiters; // ✅ important
      this.total = res.total;
      this.applyPagination();
    },
    error: (err) => console.error(err)
  });
}

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

  applyFilters() {
  let data = [...this.recruiters];

  if (this.searchText) {
    data = data.filter(r =>
      r.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCompany) {
    data = data.filter(r => r.company === this.selectedCompany);
  }

  if (this.selectedPosition) {
    data = data.filter(r => r.position === this.selectedPosition);
  }

  if (this.selectedStatus) {
    data = data.filter(r => r.status === this.selectedStatus);
  }

  this.filteredRecruiters = data;
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}


resetFilters() {
  this.searchText = '';
  this.selectedCompany = '';
  this.selectedPosition = '';
  this.selectedStatus = '';

  this.filteredRecruiters = [];
  this.isFiltering = false;

  this.total = this.recruiters.length;
  this.page = 1;

  this.applyPagination();
}


getActiveFilters(): { key: string; label: string }[] {
  const f: any[] = [];

  if (this.searchText) f.push({ key: 'search', label: this.searchText });
  if (this.selectedCompany) f.push({ key: 'company', label: this.selectedCompany });
  if (this.selectedPosition) f.push({ key: 'position', label: this.selectedPosition });
  if (this.selectedStatus) f.push({ key: 'status', label: this.selectedStatus });

  return f;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'company') this.selectedCompany = '';
  if (key === 'position') this.selectedPosition = '';
  if (key === 'status') this.selectedStatus = '';

  this.applyFilters();
}




}
