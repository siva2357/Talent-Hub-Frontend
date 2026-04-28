import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../components/table/table';
import { Pagination } from '../../../components/pagination/pagination';
import { InputFields } from "../../../components/input-fields/input-fields";
import { Buttons } from "../../../components/buttons/buttons";


@Component({
  selector: 'app-seekers',
  standalone: true,
  imports: [CommonModule, Table, Pagination, InputFields, Buttons],
  templateUrl: './seekers.html',
  styleUrl: './seekers.css',
})
export class Seekers implements OnInit {

  @ViewChild('profileTpl', { static: true }) profileTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;

  columns: any[] = [];

  // 🔥 FULL DATA
  allData: any[] = [];

  // 🔥 PAGINATED DATA (sent to table)
  data: any[] = [];

  // 🔥 PAGINATION STATE
  page = 1;
  limit = 5;
  total = 0;



filters = {
  name: '',
  role: '',
  status: ''
};

appliedFilters = {
  name: '',
  role: '',
  status: ''
};

jobRoleOptions = ['Frontend Developer', 'Backend Developer'];
statusOptions = ['verified', 'pending'];



  ngOnInit() {

    // ✅ 20 DUMMY RECORDS
    this.allData = Array.from({ length: 20 }, (_, i) => ({
      _id: i + 1,
      profile: `https://i.pravatar.cc/40?img=${i + 1}`,
      fullName: `Job Seeker ${i + 1}`,
      jobRole: i % 2 === 0 ? 'Frontend Developer' : 'Backend Developer',
      experience: Math.floor(Math.random() * 5) + 1 + ' years',
      status: i % 2 === 0 ? 'verified' : 'pending',
      active: true,
    }));

    this.total = this.allData.length;

this.columns = [
  { name: 'S.No', type: 'index', center: true, width: '60px' },

  { name: 'Profile', template: this.profileTpl, width: '80px' },

  { name: 'Full Name', prop: 'fullName', width: '150px' },

  { name: 'Job Role', prop: 'jobRole', width: '180px' },

  { name: 'Experience', prop: 'experience', width: '80px' },

  { name: 'Status', template: this.statusTpl, center: true, width: '100px' },

  { name: 'Action', template: this.actionTpl, center: true, width: '300px' }
];

this.applyFilter();
  }

applyFilter() {

  let filtered = this.allData;

  // 🔍 NAME
  if (this.appliedFilters.name) {
    filtered = filtered.filter(r =>
      r.fullName.toLowerCase().includes(this.appliedFilters.name.toLowerCase())
    );
  }

  if (this.appliedFilters.role) {
  filtered = filtered.filter(r =>
    r.jobRole === this.appliedFilters.role
  );
}

  // 📌 STATUS
  if (this.appliedFilters.status) {
    filtered = filtered.filter(r =>
      r.status === this.appliedFilters.status
    );
  }

  this.total = filtered.length;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.data = filtered.slice(start, end);
}


onApplyFilters() {
  this.appliedFilters = { ...this.filters }; // copy values
  this.page = 1;
  this.applyFilter();
}
onResetFilters() {
  this.filters = { name: '', role: '', status: '' };
  this.appliedFilters = { name: '', role: '', status: '' };
  this.page = 1;
  this.applyFilter();
}

removeFilter(type: 'name' | 'role' | 'status') {
  this.appliedFilters[type] = '';
  this.filters[type] = ''; // also reset input UI
  this.page = 1;
  this.applyFilter();
}

  // 🔥 PAGINATION LOGIC
  updateTable() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    this.data = this.allData.slice(start, end);
  }

onPageChange(p: number) {
  this.page = p;
  this.applyFilter();
}

onLimitChange(l: number) {
  this.limit = l;
  this.page = 1;
  this.applyFilter();
}

  // ACTIONS
  viewProfile(row: any) { console.log(row); }
  blockUser(row: any) { console.log(row); }
  unblockUser(row: any) { console.log(row); }
  deactivateUser(row: any) { console.log(row); }
  activateUser(row: any) { console.log(row); }
}

