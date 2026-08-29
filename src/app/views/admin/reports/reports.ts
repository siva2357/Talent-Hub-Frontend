import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ReportCard } from '../../shared/report-card/report-card';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportCard, Button, InputField],
  providers: [DatePipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  reports: any[] = [];
  isLoading = true;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.fetchReports();
  }

  fetchReports() {
    this.isLoading = true;
    this.adminService.getReports().subscribe({
      next: (res) => {
        if (res.success) {
          this.reports = res.reports || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports', err);
        this.isLoading = false;
      }
    });
  }
}
