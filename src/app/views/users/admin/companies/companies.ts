import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../../core/services/company-service';
import { Company } from '../../../../core/models/company.modal';
import { FilePreview } from "../../../shared/file-preview/file-preview";
import { FileUpload } from "../../../shared/file-upload/file-upload";
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';


@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FilePreview, FileUpload],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit {
editCompanyForm!: FormGroup;
selectedCompanyId: string | null = null;
editSubmitted = false;
companyId!: string; // class property

  userId!: string;
  fullName!: string;
  BucketKey = BucketKey;
  UploadSection = UploadSection;
  companyLogoUrl!: string;
  /* =========================
     STATE
  ========================= */
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  paginatedCompanies: Company[] = [];

  loading = false;
  errorMessage: string | null = null;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  totalEntries = 0;
  pageNumbers: number[] = [];

  /* =========================
     FORM
  ========================= */
  addCompanyForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();
    this.initEditForm();
    const user = JSON.parse(localStorage.getItem('userData') || '{}');

    const data = JSON.parse(user);
    this.userId = data.userId;
    this.fullName = data.fullName;

  }



  loadCompanies(): void {
    this.loading = true;

    this.companyService.getCompanies().subscribe({
      next: res => {
        this.companies = res.companies;
        this.filteredCompanies = [...this.companies];
        this.updatePagination();
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
  }


  /* =========================
     FORM INIT
  ========================= */
private initForm(): void {
  this.addCompanyForm = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    industry: ['', Validators.required],
    companyAddress: ['', Validators.required],
    companyDescription: ['', [Validators.required, Validators.minLength(10)]],
    companyWebsiteUrl: ['', [
      Validators.required,
      Validators.pattern('https?://.+')
    ]],
    companyLogo: [null, Validators.required],
  });
}

private initEditForm(): void {
  this.editCompanyForm = this.fb.group({
    companyName: ['', [Validators.required, Validators.minLength(3)]],
    industry: ['', Validators.required],
    companyAddress: ['', Validators.required],
    companyDescription: ['', [Validators.required, Validators.minLength(10)]],
    companyWebsiteUrl: ['', [
      Validators.required,
      Validators.pattern('https?://.+')
    ]],
    companyLogo: [null], // NOT required on edit
  });
}


  get f() {
    return this.addCompanyForm.controls;
  }



openEditModal(company: Company): void {
  this.selectedCompanyId = company._id!;
  this.editSubmitted = false;

  this.companyId = company.companyDetails.companyId; // ✅ STORE IT

  this.companyLogoUrl = company.companyDetails.companyLogo?.url || '';

  this.editCompanyForm.reset();
  this.editCompanyForm.patchValue({
    companyName: company.companyDetails.companyName,
    industry: company.companyDetails.industry,
    companyAddress: company.companyDetails.companyAddress,
    companyDescription: company.companyDetails.companyDescription,
    companyWebsiteUrl: company.companyDetails.companyWebsiteUrl,
    companyLogo: company.companyDetails.companyLogo
  });
}


submitCompany(): void {
  this.addCompanyForm.get('companyLogo')?.markAsTouched();

  if (this.addCompanyForm.invalid) {
    this.addCompanyForm.markAllAsTouched();
    return;
  }

  const formValue = this.addCompanyForm.getRawValue();

  const payload = {
    companyDetails: {
      companyId: Date.now().toString(), // or backend-generated
      companyName: formValue.companyName,
      industry: formValue.industry,
      companyAddress: formValue.companyAddress,
      companyDescription: formValue.companyDescription,
      companyWebsiteUrl: formValue.companyWebsiteUrl,
      companyLogo: {
        fileName: 'Company Logo',
        url: this.companyLogoUrl
      }
    }
  };

  this.companyService.createCompany(payload).subscribe({
    next: () => {
      this.addCompanyForm.reset();
      this.submitted = false;
      this.companyLogoUrl = '';
      this.loadCompanies();
    },
    error: err => {
      this.errorMessage = err;
    }
  });
}


updateCompany(): void {
  this.editSubmitted = true;

  if (this.editCompanyForm.invalid || !this.selectedCompanyId) {
    this.editCompanyForm.markAllAsTouched();
    return;
  }

  const payload = {
    companyDetails: {
      companyId: this.companyId, // ✅ REQUIRED
      ...this.editCompanyForm.value,
            companyLogo: {
        fileName: 'Company Logo',
        url: this.companyLogoUrl
      }
    }
  };

  this.companyService
    .updateCompany(this.selectedCompanyId, payload)
    .subscribe({
      next: () => {
        this.loadCompanies();
        this.selectedCompanyId = null;
        this.editSubmitted = false;
      },
      error: err => {
        this.errorMessage = err;
      }
    });
}






onPhotoUploaded(url: string): void {
  this.companyLogoUrl = url + '?v=' + Date.now();

  // 👇 bind upload result to form
  this.addCompanyForm.get('companyLogo')?.setValue(url);
  this.addCompanyForm.get('companyLogo')?.markAsTouched();
}

  /* =========================
     ACTIONS
  ========================= */
  viewCompany(id: string): void {
    this.router.navigate([`admin/companies/${id}/company-details`]);
  }

  deleteCompany(id: string): void {
    if (!confirm('Delete this company?')) return;

    this.companyService.deleteCompany(id).subscribe(() => {
      this.loadCompanies();
    });
  }

  /* =========================
     PAGINATION
  ========================= */
  updatePagination(): void {
    this.totalEntries = this.filteredCompanies.length;
    this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.paginateCompanies();
  }

  paginateCompanies(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedCompanies = this.filteredCompanies.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );

    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateCompanies();
  }
}
