import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../../core/services/company-service';
import { Company } from '../../../../core/models/company.modal';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-details.html',
  styleUrl: './company-details.css',
})
export class CompanyDetails implements OnInit {

  companyId!: string;
  company!: Company;

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id')!;
    this.loadCompany();
  }

  loadCompany(): void {
    this.loading = true;

    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (res) => {
        this.company = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
  }
}
