import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CompanyService } from '../../../../core/services/company-service';
import { Company } from '../../../../core/models/company.modal';
@Component({
  selector: 'app-company-details-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-details-page.html',
  styleUrl: './company-details-page.css'
})
export class CompanyDetailsPage implements OnInit {

  companyId!: string;
  company!: Company;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  /* =========================
     Lifecycle
  ========================== */
  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id')!;
    this.fetchCompanyDetails();
  }

  /* =========================
     Fetch Company
  ========================== */
  fetchCompanyDetails(): void {
    this.companyService.getCompanyDetails(this.companyId).subscribe({
      next: (response) => {
        this.company = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load company details';
        this.loading = false;
      }
    });
  }
}
