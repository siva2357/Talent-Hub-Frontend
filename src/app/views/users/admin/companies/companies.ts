import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CompanyService } from '../../../../core/services/company-service';
import { Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { FileUpload } from "../../../shared/file-upload/file-upload";
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';
import { FilePreview } from "../../../shared/file-preview/file-preview";


@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUpload, FilePreview],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit {
  companies: Company[] = [];
  selectedCompany: Company | null = null;

  showFormModal = false;
  isEditMode = false;
submitting = false;
  companyForm!: FormGroup;
  loading = false;
  BucketKey = BucketKey;
  UploadSection = UploadSection;
 logoUrl!: string;
  constructor(
    private companyService: CompanyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCompanies();
  }

initForm() {
  this.companyForm = this.fb.group({
    companyName: [ '', [Validators.required]],
    companyLocation: ['',[Validators.required]],
    companyDescription: ['',[Validators.required]],
    companyLogo: ['',[Validators.required]],
    companyFoundedDate: ['',[Validators.required]],
    companySize: ['',[Validators.required]],
    totalEmployees: [null,[Validators.required]]
  });
}
  fetchCompanies() {
    this.loading = true;
    this.companyService.getAllCompanies().subscribe({
      next: (res) => {
        this.companies = res.data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

openAddModal() {
  this.isEditMode = false;
  this.selectedCompany = null;
  this.companyForm.reset();
  this.logoUrl = '';
  this.companyForm.markAsPristine();
  this.companyForm.markAsUntouched();
  this.showFormModal = true;
}

openEditModal(company: Company) {
  this.isEditMode = true;
  this.selectedCompany = company;

  this.companyForm.patchValue({
    companyName: company.companyName,
    companyLocation: company.companyLocation,
    companyDescription: company.companyDescription,
    companyLogo: company.companyLogo,
    companyFoundedDate: company.companyFoundedDate ? new Date(company.companyFoundedDate).toISOString().split('T')[0] : '',
    companySize: company.companySize,
    totalEmployees: company.totalEmployees
  });

  this.logoUrl = company.companyLogo;

  this.showFormModal = true;
}

submitForm() {

  if (this.companyForm.invalid) {
    this.companyForm.markAllAsTouched();
    return;
  }

  if (this.submitting) return; // 🔥 prevent double click

  this.submitting = true;

  const payload = {
    ...this.companyForm.value,
    companyLogo: this.companyForm.value.companyLogo
  };

  const request$ = this.isEditMode && this.selectedCompany
    ? this.companyService.updateCompany(this.selectedCompany._id, payload)
    : this.companyService.createCompany(payload);

  request$.subscribe({
    next: () => {
      this.fetchCompanies();
      this.closeFormModal();
      this.submitting = false;
    },
    error: (err) => {
      console.error('Company submit error:', err);
      this.submitting = false;
    }
  });
}

  deleteCompany(companyId: string) {
    if (!confirm('Delete this company?')) return;

    this.companyService.deleteCompany(companyId).subscribe(() => {
      this.fetchCompanies();
    });
  }

closeFormModal() {
  this.showFormModal = false;
  this.companyForm.reset();
  this.logoUrl = '';
  this.selectedCompany = null;
  this.isEditMode = false;
}

  goToDetails(companyId: string) {
    this.router.navigate(['admin/company-list', companyId, 'details']);
  }

onlogoUploaded(url: string): void {
  if (!url) return;

  this.logoUrl = url + '?v=' + Date.now();

  this.companyForm.patchValue({
    companyLogo: url
  });

  this.companyForm.get('companyLogo')?.markAsTouched();
  this.companyForm.get('companyLogo')?.updateValueAndValidity();
}


}
