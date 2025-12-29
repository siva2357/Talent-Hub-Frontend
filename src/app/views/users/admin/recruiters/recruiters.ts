import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recruiters',
  standalone: true,
  templateUrl: './recruiters.html',
  styleUrl: './recruiters.css',
})
export class Recruiters {
  recruiters: any[] = [];
  filteredRecruiter: any[] = [];
  paginatedRecruiters: any[] = [];
  errorMessage: string | null = null;
  loading = false;
  adminId!: string;
selectedRecruiter: any | null = null;
openLogsModal(recruiter: any) {
  this.selectedRecruiter = recruiter;
}

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  totalEntries = 0;
  pageNumbers: number[] = [];


  constructor(private router: Router, private adminService: AdminService) {}
  ngOnInit() {
    this.adminId = localStorage.getItem('userId') || '';
    if (this.adminId) {
      this.fetchRecruiters();
    } else {
      this.errorMessage = 'Admin ID is missing. Please log in again.';
    }
  }

  fetchRecruiters(): void {
    this.loading = true;
    this.adminService.getAllRecruiters().subscribe({
      next: (res) => {
        this.recruiters = res.recruiters || [];
        this.filteredRecruiter = [...this.recruiters]; // ✅ Initialize filtering
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load clients.';
        this.loading = false;
      }
    });
  }

  viewRecruiterProfile(id: string): void {
    this.router.navigate([`admin/recruiters-list/${id}/profile`]);
  }

  approveRecruiter(userId: string) {
  this.loading = true;

  this.adminService.approveUser({
    userId,
    role: 'recruiter'
  }).subscribe({
    next: () => {
      this.fetchRecruiters(); // refresh list
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'Failed to approve recruiter';
      this.loading = false;
    }
  });
}

rejectRecruiter(userId: string) {
  if (!confirm('Are you sure you want to permanently block this recruiter?')) {
    return;
  }

  this.loading = true;

  this.adminService.rejectUser({
    userId,
    role: 'recruiter'
  }).subscribe({
    next: () => {
      this.fetchRecruiters(); // refresh list
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'Failed to reject recruiter';
      this.loading = false;
    }
  });
}


  /** Pagination */
  updatePagination(): void {
    this.totalEntries = this.filteredRecruiter.length;
    this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.paginateClients();
  }

  paginateClients(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedRecruiters = this.filteredRecruiter.slice(startIndex, startIndex + this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateClients();
  }

  getStartIndex(): number {
    return this.totalEntries ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalEntries);
  }

}
