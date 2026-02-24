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

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit {
  companies: Company[] = [];
  selectedCompany: Company | null = null;

  showFormModal = false;
  isEditMode = false;

  companyForm!: FormGroup;
  loading = false;

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
      companyName: ['', Validators.required],
      companyLocation: ['', Validators.required],
      companyDescription: ['', Validators.required],
      companyLogo: ['', Validators.required],
      companyFoundedDate: ['', Validators.required],
      companySize: ['', Validators.required],
      totalEmployees: [0, [Validators.required, Validators.min(1)]],
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
    this.showFormModal = true;
  }

  openEditModal(company: Company) {
    this.isEditMode = true;
    this.selectedCompany = company;
    this.companyForm.patchValue(company);
    this.showFormModal = true;
  }

  submitForm() {
    if (this.companyForm.invalid) return;

    const payload = this.companyForm.value;

    if (this.isEditMode && this.selectedCompany) {
      this.companyService
        .updateCompany(this.selectedCompany._id, payload)
        .subscribe(() => {
          this.fetchCompanies();
          this.closeFormModal();
        });
    } else {
      this.companyService.createCompany(payload).subscribe(() => {
        this.fetchCompanies();
        this.closeFormModal();
      });
    }
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
  }

  goToDetails(companyId: string) {
    this.router.navigate(['admin/company-list', companyId, 'details']);
  }
}
