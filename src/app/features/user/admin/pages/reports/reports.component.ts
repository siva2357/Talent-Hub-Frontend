import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, SystemReport } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class AdminReportsComponent implements OnInit {
  private adminService = inject(AdminService);

  reports: SystemReport[] = [];
  filteredReports: SystemReport[] = [];
  
  // Generating state
  newReportTitle = '';
  newReportCategory: 'Financial' | 'User Activity' | 'Platform Health' = 'Financial';
  newReportDesc = '';
  isGenerating = false;

  searchTerm = '';
  categoryFilter: 'All' | 'Financial' | 'User Activity' | 'Platform Health' = 'All';

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.adminService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.applyFilters();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onFilterCategory(category: 'All' | 'Financial' | 'User Activity' | 'Platform Health'): void {
    this.categoryFilter = category;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReports = this.reports.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            r.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = this.categoryFilter === 'All' || r.category === this.categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }

  onGenerateReport(event: Event): void {
    event.preventDefault();
    if (!this.newReportTitle.trim() || !this.newReportDesc.trim()) {
      return;
    }

    this.isGenerating = true;
    
    // Simulate generation latency
    setTimeout(() => {
      this.adminService.generateReport(
        this.newReportTitle,
        this.newReportCategory,
        this.newReportDesc
      );
      
      // Reset inputs
      this.newReportTitle = '';
      this.newReportDesc = '';
      this.isGenerating = false;
      
      // Reload
      this.loadReports();
    }, 1200);
  }

  onTitleInput(event: any): void {
    this.newReportTitle = event.target.value;
  }

  onDescInput(event: any): void {
    this.newReportDesc = event.target.value;
  }

  onCategorySelect(event: any): void {
    this.newReportCategory = event.target.value;
  }
}
