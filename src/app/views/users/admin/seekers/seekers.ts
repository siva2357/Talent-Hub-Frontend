import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seekers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seekers.html',
  styleUrl: './seekers.css',
})
export class Seekers {

  jobSeekers: any[] = [];
  filteredJobSeekers: any[] = [];
  paginatedJobSeekers: any[] = [];

  selectedJobSeeker: any | null = null;

  errorMessage: string | null = null;
  loading = false;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  totalEntries = 0;
  pageNumbers: number[] = [];

  constructor(
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.fetchJobSeekers();
  }

  /* ================= FETCH ================= */
  fetchJobSeekers(): void {
    this.loading = true;

    this.adminService.getAllJobSeekers().subscribe({
      next: (res) => {
        this.jobSeekers = res.jobSeekers || [];
        this.filteredJobSeekers = [...this.jobSeekers];
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load job seekers';
        this.loading = false;
      }
    });
  }

  /* ================= ACTIONS ================= */
  viewJobSeekerProfile(id: string): void {
    this.router.navigate([`admin/seekers-list/${id}/profile`]);
  }

  approveJobSeeker(userId: string): void {
    this.loading = true;

    this.adminService.approveUser({
      userId,
      role: 'jobSeeker'
    }).subscribe({
      next: () => {
        this.fetchJobSeekers();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to approve job seeker';
        this.loading = false;
      }
    });
  }

  rejectJobSeeker(userId: string): void {
    if (!confirm('Are you sure you want to permanently block this job seeker?')) {
      return;
    }

    this.loading = true;

    this.adminService.rejectUser({
      userId,
      role: 'jobSeeker'
    }).subscribe({
      next: () => {
        this.fetchJobSeekers();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to reject job seeker';
        this.loading = false;
      }
    });
  }

  openLogsModal(jobSeeker: any): void {
    this.selectedJobSeeker = jobSeeker;
  }

  /* ================= PAGINATION ================= */
  updatePagination(): void {
    this.totalEntries = this.filteredJobSeekers.length;
    this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedJobSeekers =
      this.filteredJobSeekers.slice(start, start + this.itemsPerPage);

    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginate();
  }

  getStartIndex(): number {
    return this.totalEntries ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalEntries);
  }
}
