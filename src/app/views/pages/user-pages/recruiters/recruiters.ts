import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../components/table/table';
import { Pagination } from '../../../components/pagination/pagination';
import { InputFields } from "../../../components/input-fields/input-fields";
import { Buttons } from "../../../components/buttons/buttons";


@Component({
  selector: 'app-recruiters',
  standalone: true,
  templateUrl: './recruiters.html',
  styleUrl: './recruiters.css',
  imports: [CommonModule, Table, Pagination, InputFields, Buttons],
})
export class Recruiters implements OnInit {

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
  company: '',
  status: ''
};

// ✅ NEW → applied filters
appliedFilters = {
  name: '',
  company: '',
  status: ''
};

companyOptions = ['TCS', 'Infosys'];
statusOptions = ['verified', 'pending'];



  ngOnInit() {

    // ✅ 20 DUMMY RECORDS
    this.allData = Array.from({ length: 20 }, (_, i) => ({
      _id: i + 1,
      profile: `https://i.pravatar.cc/40?img=${i + 1}`,
      fullName: `Recruiter ${i + 1}`,
      company: i % 2 === 0 ? 'TCS' : 'Infosys',
      designation: 'HR Manager',
      joinedDate: '28-04-2026',
      status: i % 2 === 0 ? 'verified' : 'pending',
      active: true
    }));

    this.total = this.allData.length;

this.columns = [
  { name: 'S.No', type: 'index', center: true, width: '60px' },
  { name: 'Profile', template: this.profileTpl, width: '80px' },
  { name: 'Full Name', prop: 'fullName', width: '100px' },
  { name: 'Company', prop: 'company', width: '100px' },
  { name: 'Designation', prop: 'designation', width: '150px' },
  { name: 'Joined Date', prop: 'joinedDate', width: '100px' },
  { name: 'Status', template: this.statusTpl, center: true, width: '80px' },
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

  // 🏢 COMPANY
  if (this.appliedFilters.company) {
    filtered = filtered.filter(r =>
      r.company === this.appliedFilters.company
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
  this.filters = { name: '', company: '', status: '' };
  this.appliedFilters = { name: '', company: '', status: '' };
  this.page = 1;
  this.applyFilter();
}

removeFilter(type: 'name' | 'company' | 'status') {
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
