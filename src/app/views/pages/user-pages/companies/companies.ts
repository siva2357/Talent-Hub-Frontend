import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../../components/table/table';
import { Pagination } from '../../../components/pagination/pagination';
import { InputFields } from '../../../components/input-fields/input-fields';
import { Buttons } from '../../../components/buttons/buttons';
import { CompanyService } from '../../../../core/services/company-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Company } from '../../../../core/models/company.model';
import { FileUpload } from '../../../shared/file-upload/file-upload';
import { FilePreview } from '../../../shared/file-preview/file-preview';
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [ CommonModule, Table, Pagination, InputFields, Buttons, ReactiveFormsModule, FileUpload, FilePreview],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css'],

})

export class Companies implements OnInit {

  @ViewChild('logoTpl', { static: true })
  public logoTpl!: TemplateRef<any>;

  @ViewChild('statusTpl', { static: true })
  public statusTpl!: TemplateRef<any>;

  @ViewChild('actionTpl', { static: true })
  public actionTpl!: TemplateRef<any>;

  columns: any[] = [];
  tableActions: any[] = [];
  allData: Company[] = [];
  data: Company[] = [];

  page = 1;
  limit = 5;
  total = 0;

  filters = { name: '', location: '', status: '' };
  appliedFilters = { name: '', location: '', status: '' };
  statusOptions: ('active' | 'blocked')[] = ['active', 'blocked'];

  isModalOpen = false;
  isEditMode = false;
  selectedCompanyId: string | null = null;

  isViewModalOpen = false;
  selectedCompany: Company | null = null;
  companyForm!: FormGroup;

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  companySizeOptions: string[] = ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'];

  constructor( private companyService: CompanyService, private fb: FormBuilder ) {}

  ngOnInit() {

    this.companyPostForm();

    this.columns = [
      { name: 'S.No', type: 'index', center: true, width: '60px' },
      { name: 'Logo', template: this.logoTpl, width: '100px' },
      { name: 'Company Name', prop: 'companyName',width: '250px' },
      { name: 'Location', prop: 'companyLocation',width: '150px' },
      { name: 'Phone', prop: 'phone',width:'120px' },
      { name: 'Industry', prop: 'industry',width: '150px' },
      { name: 'Status', template: this.statusTpl, width: '100px' }
    ];

    this.tableActions = [
      { label: 'View Profile', icon: 'bi-eye', callback: (row: any) => this.viewCompany(row) },
      { label: 'Edit Details', icon: 'bi-pencil', callback: (row: any) => this.editCompany(row) },
      { label: 'Block Company', icon: 'bi-slash-circle', variant: 'danger', callback: (row: any) => this.blockCompany(row) },
      { label: 'Unblock Company', icon: 'bi-check-circle', callback: (row: any) => this.unblockCompany(row) },
      { label: 'Delete Company', icon: 'bi-trash', variant: 'danger', callback: (row: any) => this.deleteCompany(row) }
    ];

    this.fetchCompanies();
  }

  companyPostForm() {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      industry: ['', Validators.required],
      companyLocation: ['', Validators.required],
      companyDescription: ['', Validators.required],
      companyLogo: ['', Validators.required],
      companyFoundedDate: ['', Validators.required],
      companySize: [null, Validators.required],
      totalEmployees: [null, [Validators.required, Validators.min(1)]],
      companyWebsite: ['', [Validators.required]],
    });
  }

  fetchCompanies() {
    this.companyService.getAllCompanies().subscribe({
      next: (res: any) => {
        console.log('API DATA:', res);
        this.allData = res.data || [];
        this.total = this.allData.length;
        this.page = 1;
        this.applyFilter();
      },
      error: (err) => {
        console.error('Failed to load companies:', err);
        this.allData = [];
        this.data = [];
        this.total = 0;
      },
    });
  }

  getFilteredData() {
    const data = Array.isArray(this.allData) ? this.allData : [];

    const nameVal = (this.appliedFilters.name || '').trim().toLowerCase();
    const locationVal = (this.appliedFilters.location || '').trim().toLowerCase();
    const statusVal = (this.appliedFilters.status || '').trim().toLowerCase();

    return data.filter((c) => {
      const companyName = (c.companyName || '').toLowerCase();
      const companyLocation = (c.companyLocation || '').toLowerCase();
      const companyStatus = (c.status || '').toLowerCase();

      return (
        (!nameVal || companyName.includes(nameVal)) &&
        (!locationVal || companyLocation.includes(locationVal)) &&
        (!statusVal || companyStatus === statusVal)
      );
    });
  }

  openAddModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.selectedCompanyId = null;

    this.companyForm.reset();
  }

editCompany(row: any) {
  this.isModalOpen = true;
  this.isEditMode = true;
  this.selectedCompanyId = row._id;

  const formattedDate = row.companyFoundedDate
    ? new Date(row.companyFoundedDate).toISOString().split('T')[0]
    : '';

  this.companyForm.patchValue({
    companyName: row.companyName,
    email: row.email,
    phone: row.phone,
    industry: row.industry,
    companyLocation: row.companyLocation,
    companyDescription: row.companyDescription,
    companyLogo: row.companyLogo,
    companyFoundedDate: formattedDate, // ✅ FIX
    companySize: row.companySize,
    totalEmployees: row.totalEmployees,
    companyWebsite: row.companyWebsite,
  });
}

  viewCompany(row: any) {
    this.companyService.getCompanyById(row._id).subscribe({
      next: (res) => {
        this.selectedCompany = res.data;
        this.isViewModalOpen = true;
      },
    });
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedCompany = null;
  }

  onLogoUploaded(url: string) {
    this.companyForm.patchValue({
      companyLogo: url,
    });

    this.companyForm.get('companyLogo')?.markAsTouched();
  }

  submitCompany() {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    const payload = this.companyForm.value;

    const request =
      this.isEditMode && this.selectedCompanyId
        ? this.companyService.updateCompany(this.selectedCompanyId, payload)
        : this.companyService.createCompany(payload);

    request.subscribe({
      next: () => {
        this.fetchCompanies();
        this.closeModal(); // ✅ always after success
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedCompanyId = null;

    this.companyForm.reset();

    // reset dropdown default (important)
    this.companyForm.patchValue({
      companySize: null,
    });
  }

  resetForm() {
    this.companyForm.reset();
  }

  applyFilter() {
    const hasFilter =
      this.appliedFilters.name?.trim() ||
      this.appliedFilters.location?.trim() ||
      this.appliedFilters.status?.trim();

    // ✅ If no filters → use full data
    const filtered = hasFilter ? this.getFilteredData() : [...this.allData];

    console.log('FILTERED:', filtered);

    this.total = filtered.length;

    const maxPage = Math.ceil(this.total / this.limit) || 1;
    if (this.page > maxPage) {
      this.page = maxPage;
    }

    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.data = filtered.slice(start, end);

    console.log('FINAL DATA:', this.data);
  }

  applyPagination() {
    this.total = this.allData.length;

    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;

    this.data = this.allData.slice(start, end);

    console.log('PAGINATED DATA:', this.data);
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

  deleteCompany(row: any) {
    if (confirm(`Delete ${row.companyName}?`)) {
      this.companyService.deleteCompany(row._id).subscribe({
        next: () => {
          this.fetchCompanies();
        },
      });
    }
  }

  blockCompany(row: Company) {
    this.companyService.blockCompany(row._id).subscribe({
      next: (res) => {
        row.status = res.data.status; // sync with backend
        row.actions = res.data.actions; // ✅ FIX
        this.applyFilter();
      },
      error: (err) => console.error(err),
    });
  }

  unblockCompany(row: Company) {
    this.companyService.unblockCompany(row._id).subscribe({
      next: (res) => {
        row.status = res.data.status;
        row.actions = res.data.actions; // ✅ FIX
        this.applyFilter();
      },
      error: (err) => console.error(err),
    });
  }

  closeCompany(row: Company) {
    this.companyService.closeCompany(row._id).subscribe({
      next: (res) => {
        row.status = res.data.status;
        row.actions = res.data.actions; // ✅ FIX
        this.applyFilter();
      },
      error: (err) => console.error(err),
    });
  }

  reopenCompany(row: Company) {
    this.companyService.reopenCompany(row._id).subscribe({
      next: (res) => {
        row.status = res.data.status;
        row.actions = res.data.actions; // ✅ FIX
        this.applyFilter();
      },
      error: (err) => console.error(err),
    });
  }

}
