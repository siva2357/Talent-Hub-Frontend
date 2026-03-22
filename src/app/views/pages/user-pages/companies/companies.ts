import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
import { Buttons } from "../../../components/buttons/buttons";
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InputFields } from "../../../components/input-fields/input-fields";
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/company-service';
import { FilePreview } from "../../../shared/file-preview/file-preview";
import { FileUpload } from "../../../shared/file-upload/file-upload";
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';
@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, Table, Pagination, Buttons, FormsModule, InputFields, ReactiveFormsModule, FilePreview, FileUpload],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit {

  locations = ['India', 'United States', 'United Kingdom', 'Remote'];

industries = ['Software', 'Finance', 'Healthcare', 'Education', 'E-commerce'];

statuses = ['Active', 'Inactive', 'Blocked'];

searchText = '';
selectedLocation = '';
selectedIndustry = '';
selectedStatus = '';
isEditMode = false;
selectedCompanyId: string | null = null;

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  @ViewChild('imageTemplate', { static: true })
  public imageTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  columns: any[] = [];
companies: Company[] = [];
isLoading = false;
companyForm!: FormGroup;

  page = 1;
limit = 5;
total = 0;
selectedCompany: Company | null = null;
paginatedCompanies: any[] = [];
isFiltering = false;

BucketKey = BucketKey;
UploadSection = UploadSection;

selectedDeleteCompanyId: string | null = null;

constructor(private fb: FormBuilder, private companyService :CompanyService ) {

this.companyForm = this.fb.group({
  companyName: ['', Validators.required],
  industry: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.minLength(10)]],
  companyLocation: ['', Validators.required],
  companySize: [null, Validators.required],
  totalEmployees: [null, [Validators.required, Validators.min(1)]],
  companyFoundedDate: ['', Validators.required],
  companyDescription: ['', [Validators.required, Validators.minLength(10)]],
  companyLogo: [''] // optional for now
});


}

  ngOnInit() {
this.columns = [
  { name: 'S.NO', prop: 'sno' }, // ✅ new
  { name: 'Logo', template: this.imageTemplateRef },
  { name: 'Company Name', prop: 'companyName' },
  { name: 'Email', prop: 'email' },
  { name: 'Phone', prop: 'phone' },
  { name: 'Location', prop: 'companyLocation' },
  { name: 'Industry', prop: 'industry' },
  { name: 'Action', template: this.actionsTemplateRef, center: true },
];
    this.getCompanies();
  }






onSubmit() {
  if (this.companyForm.invalid) {
    this.companyForm.markAllAsTouched();
    return;
  }

  const payload = this.companyForm.value;

  if (this.isEditMode && this.selectedCompanyId) {
    // UPDATE
    this.companyService.updateCompany(this.selectedCompanyId, payload)
      .subscribe(() => {
        this.afterSave();
      });
  } else {
    // CREATE
    this.companyService.createCompany(payload)
      .subscribe(() => {
        this.afterSave();
      });
  }
}


onLogoUploaded(url: string) {
  this.companyForm.patchValue({
    companyLogo: url
  });
}

afterSave() {
  this.companyForm.reset();
  this.selectedCompanyId = null;
  this.isEditMode = false;

  // close modal manually
  const modal = document.getElementById('companyFormModal');
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  // reload list
  this.getCompanies();
}


getCompanies() {
  this.isLoading = true;

  this.companyService.getAllCompanies().subscribe({
    next: (res) => {
      this.companies = res.data || [];

      this.total = this.companies.length;   // ✅ set total
      this.applyPagination();               // ✅ IMPORTANT

      this.isLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}



applyPagination() {
  const source = this.filteredCompanies.length || this.isFiltering
    ? this.filteredCompanies
    : this.companies;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedCompanies = source.slice(start, end).map((item, index) => ({
    ...item,
    sno: start + index + 1 // ✅ generates 1,2,3,4...
  }));
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

openAddModal() {
  this.isEditMode = false;
  this.selectedCompanyId = null;
  this.companyForm.reset();
}

openEditModal(company: Company) {
  this.isEditMode = true;
  this.selectedCompanyId = company._id;
  this.companyForm.patchValue({
    companyName: company.companyName,
    industry: company.industry,
    email: company.email,
    phone: company.phone,
    companyLocation: company.companyLocation,
    companySize: company.companySize,
    totalEmployees: company.totalEmployees,
      companyFoundedDate: company.companyFoundedDate
      ? new Date(company.companyFoundedDate).toISOString().substring(0, 10)
      : '',
    companyDescription: company.companyDescription,
    companyLogo: company.companyLogo
  });
}

openViewModal(company: Company) {
  this.selectedCompany = company;
}

filteredCompanies: any[] = [];

applyFilters() {
  let data = [...this.companies];

  if (this.searchText) {
    data = data.filter(c =>
      c.companyName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedLocation) {
    data = data.filter(c => c.companyLocation === this.selectedLocation);
  }

  if (this.selectedIndustry) {
    data = data.filter(c => c.industry === this.selectedIndustry);
  }

  if (this.selectedStatus) {
    data = data.filter(c => c.status === this.selectedStatus);
  }

  this.filteredCompanies = data;
  this.isFiltering = true;   // ✅ important

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedLocation = '';
  this.selectedIndustry = '';
  this.selectedStatus = '';

  this.filteredCompanies = [];
  this.isFiltering = false; // ✅ important

  this.total = this.companies.length;
  this.page = 1;

  this.applyPagination();
}



getActiveFilters(): { key: string; label: string }[] {
  const filters: { key: string; label: string }[] = [];

  if (this.searchText) {
    filters.push({ key: 'search', label: this.searchText });
  }

  if (this.selectedLocation) {
    filters.push({ key: 'location', label: this.selectedLocation });
  }

  if (this.selectedIndustry) {
    filters.push({ key: 'industry', label: this.selectedIndustry });
  }

  if (this.selectedStatus) {
    filters.push({ key: 'status', label: this.selectedStatus });
  }

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'location') this.selectedLocation = '';
  if (key === 'industry') this.selectedIndustry = '';
  if (key === 'status') this.selectedStatus = '';
  this.applyFilters(); // re-run filtering
}


openDeleteModal(company: Company) {
   this.selectedDeleteCompanyId = company._id;
  this.selectedCompany = company; // optional for UI
}


confirmDelete() {
  if (!this.selectedDeleteCompanyId) return;

  this.companyService.deleteCompany(this.selectedDeleteCompanyId)
    .subscribe({
      next: () => {

        // close modal
        const modalEl = document.getElementById('deleteCompanyModal');
        if (modalEl) {
          (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
        }

        // reset
        this.selectedDeleteCompanyId = null;

        // refresh list
        this.getCompanies();
      },
      error: (err) => {
        console.error(err);
      }
    });
}

}
