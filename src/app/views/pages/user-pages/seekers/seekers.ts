import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Buttons } from '../../../components/buttons/buttons';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
import { AdminService } from '../../../../core/services/admin-service';

@Component({
  selector: 'app-seekers',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, Buttons, Table, Pagination],

  templateUrl: './seekers.html',
  styleUrl: './seekers.css',
})
export class Seekers implements OnInit{

  searchText = '';
selectedExperience = '';
selectedCategory = '';
selectedStatus = '';

filteredSeekers: any[] = [];
isFiltering = false;

experiences = ['0–1 Years', '1–2 Years', '2–3 Years', '3–5 Years', '5–8 Years', '8+ Years'];

categories = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Java Developer', 'Python Developer', 'Mobile Developer','DevOps Engineer','Data Analyst'];


statuses = ['Active', 'Inactive', 'Blocked'];

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  @ViewChild('imageTemplate', { static: true })
  public imageTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  columns: any[] = [];
seekers:any[] =[]

  page = 1;
limit = 5;
total = 0;

paginatedJobSeekers: any[] = [];
  constructor(private adminService:AdminService) {}

  ngOnInit() {
    this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Profile', template: this.imageTemplateRef },
      { name: 'Full Name', prop: 'name' },
      { name: 'Email', prop: 'email' },
      { name: 'Phone', prop: 'phone' },
       { name: 'Category', prop: 'category' },       // ✅ NEW
  { name: 'Experience', prop: 'experience' },   // ✅ NEW
      { name: 'Status', template: this.statusTemplateRef },
      { name: 'Action', template: this.actionsTemplateRef, center: true },
    ];
          this.total = this.seekers.length;
  this.applyPagination();

    this.jobSeekerList()

  }


  jobSeekerList() {
  this.adminService.getAllJobSeekers().subscribe({
    next: (res: any) => {
      this.seekers = res.jobSeekers; // ✅ important
      this.total = res.total;
      this.applyPagination();
    },
    error: (err) => console.error(err)
  });
}

applyPagination() {
  const source = this.isFiltering ? this.filteredSeekers : this.seekers;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedJobSeekers = source.slice(start, end);
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
  let data = [...this.seekers];

  if (this.searchText) {
    data = data.filter(s =>
      s.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory) {
    data = data.filter(s => s.category === this.selectedCategory);
  }

  if (this.selectedExperience) {
    data = data.filter(s => s.experience === this.selectedExperience);
  }

  if (this.selectedStatus) {
    data = data.filter(s => s.status === this.selectedStatus);
  }

  this.filteredSeekers = data;
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

mapExperience(position: string): string {
  if (position.toLowerCase().includes('manager')) return '5–8 Years';
  if (position.toLowerCase().includes('lead')) return '3–5 Years';
  if (position.toLowerCase().includes('senior')) return '3–5 Years';
  return '1–2 Years';
}


resetFilters() {
  this.searchText = '';
  this.selectedExperience = '';
  this.selectedCategory = '';
  this.selectedStatus = '';

  this.filteredSeekers = [];
  this.isFiltering = false;

  this.total = this.seekers.length;
  this.page = 1;

  this.applyPagination();
}


getActiveFilters(): { key: string; label: string }[] {
  const f: any[] = [];

  if (this.searchText) f.push({ key: 'search', label: this.searchText });
  if (this.selectedExperience) f.push({ key: 'experience', label: this.selectedExperience });
  if (this.selectedCategory) f.push({ key: 'category', label: this.selectedCategory });
  if (this.selectedStatus) f.push({ key: 'status', label: this.selectedStatus });

  return f;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'experience') this.selectedExperience = '';
  if (key === 'category') this.selectedCategory = '';
  if (key === 'status') this.selectedStatus = '';

  this.applyFilters();
}

}
