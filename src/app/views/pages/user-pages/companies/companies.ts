import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../components/table/table';
import { Pagination } from '../../../components/pagination/pagination';
import { InputFields } from '../../../components/input-fields/input-fields';
import { Buttons } from '../../../components/buttons/buttons';

interface Company {
  _id: number;
  logo: string;
  companyName: string;
  location: string;
  foundedYear: number;
  phone: string;
  website: string;
  status: 'active' | 'blocked';
}

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, Table, Pagination, InputFields, Buttons],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit {

  @ViewChild('logoTpl', { static: true }) logoTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;

  columns: any[] = [];
  allData: Company[] = [];
  data: Company[] = [];

  page = 1;
  limit = 5;
  total = 0;

  filters = { name: '', location: '', status: ''};
  appliedFilters = { name: '', location: '', status: ''};
  statusOptions: ('active' | 'blocked')[] = ['active', 'blocked'];

  ngOnInit() {
    this.allData = Array.from({ length: 20 }, (_, i): Company => ({
      _id: i + 1,
      logo: `https://i.pravatar.cc/40?img=${i + 10}`,
      companyName: `Company  ${i + 1}`,
      location: i % 2 === 0 ? 'Hyderabad' : 'Bangalore',
      foundedYear: 2000 + (i % 20),
      phone: `98765${10000 + i}`,
      website: `www.company${i + 1}.com`,
      status: i % 2 === 0 ? 'active' : 'blocked'
    }));

    this.total = this.allData.length;

    this.columns = [
      { name: 'S.No', type: 'index', center: true, width: '60px' },
      { name: 'Logo', template: this.logoTpl, width: '80px' },
      { name: 'Company Name', prop: 'companyName', width: '180px' },
      { name: 'Location', prop: 'location', width: '140px' },
      { name: 'Founded', prop: 'foundedYear', width: '100px' },
      { name: 'Phone', prop: 'phone', width: '140px' },
      { name: 'Website', prop: 'website', width: '150px' },
      { name: 'Status', template: this.statusTpl, center: true, width: '100px' },
      { name: 'Actions', template: this.actionTpl, center: true, width: '320px' }
    ];

    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.allData];

    // FILTERS
    if (this.appliedFilters.name) {
      filtered = filtered.filter(c =>
        c.companyName.toLowerCase().includes(this.appliedFilters.name.toLowerCase())
      );
    }

    if (this.appliedFilters.location) {
      filtered = filtered.filter(c =>
        c.location.toLowerCase().includes(this.appliedFilters.location.toLowerCase())
      );
    }

    if (this.appliedFilters.status) {
      filtered = filtered.filter(c =>
        c.status === this.appliedFilters.status
      );
    }

    // TOTAL UPDATE
    this.total = filtered.length;

    // ✅ FIX: HANDLE PAGE OVERFLOW
    const maxPage = Math.ceil(this.total / this.limit) || 1;
    if (this.page > maxPage) {
      this.page = maxPage;
    }

    // PAGINATION
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.data = filtered.slice(start, end);
  }

  onApplyFilters() {
    this.appliedFilters = { ...this.filters };
    this.page = 1;
    this.applyFilter();
  }

  onResetFilters() {
    this.filters = { name: '', location: '', status: '' };
    this.appliedFilters = { name: '', location: '', status: '' };
    this.page = 1;
    this.applyFilter();
  }

  removeFilter(type: 'name' | 'location' | 'status') {
    this.filters[type] = '';
    this.appliedFilters[type] = '';
    this.page = 1;
    this.applyFilter();
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

  viewCompany(row: Company) {
    console.log('View', row);
  }

  editCompany(row: Company) {
    console.log('Edit', row);
  }

  deleteCompany(row: Company) {
    if (confirm(`Delete ${row.companyName}?`)) {
      console.log('Delete', row);
    }
  }

  blockCompany(row: Company) {
    row.status = 'blocked';
    this.applyFilter();
  }

  unblockCompany(row: Company) {
    row.status = 'active';
    this.applyFilter();
  }

}
