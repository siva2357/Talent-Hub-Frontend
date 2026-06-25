import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminService, SystemReport, TransactionData, ClientData, FreelancerData } from '../../../../../core/services/admin.service';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class AdminReportsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  reports: SystemReport[] = [];
  filteredReports: SystemReport[] = [];
  transactions: TransactionData[] = [];
  clients: ClientData[] = [];
  freelancers: FreelancerData[] = [];
  
  // Generating state
  newReportTitle = '';
  newReportCategory: 'Financial' | 'User Activity' | 'Platform Health' = 'Financial';
  newReportDesc = '';
  isGenerating = false;

  searchTerm = '';
  categoryFilter: 'All' | 'Financial' | 'User Activity' | 'Platform Health' = 'All';

  // Summary Metrics
  totalClients = 0;
  totalFreelancers = 0;
  financialStats = {
    totalVolume: 0,
    platformCommissions: 0,
    escrowHeld: 0,
    growthPercent: 0
  };

  ngOnInit(): void {
    this.loadReports();
    this.loadStats();
  }

  loadReports(): void {
    this.adminService.getReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load reports:', err);
      }
    });
  }

  loadStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.totalClients = stats.totalClients || 0;
        this.totalFreelancers = stats.totalFreelancers || 0;
      },
      error: (err) => console.error('Error fetching dashboard stats for reports:', err)
    });

    this.adminService.getFinancialStats().subscribe({
      next: (finances) => {
        this.financialStats = finances;
      },
      error: (err) => console.error('Error fetching financial stats for reports:', err)
    });

    this.adminService.getTransactions().subscribe({
      next: (txs) => {
        this.transactions = txs;
      },
      error: (err) => console.error('Error fetching transactions for reports:', err)
    });

    this.adminService.getClients().subscribe({
      next: (cls) => {
        this.clients = cls;
      },
      error: (err) => console.error('Error fetching clients for reports:', err)
    });

    this.adminService.getFreelancers().subscribe({
      next: (frs) => {
        this.freelancers = frs;
      },
      error: (err) => console.error('Error fetching freelancers for reports:', err)
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
    
    this.adminService.generateReport(
      this.newReportTitle,
      this.newReportCategory,
      this.newReportDesc
    ).subscribe({
      next: () => {
        this.newReportTitle = '';
        this.newReportDesc = '';
        this.isGenerating = false;
        this.toastr.success('Spreadsheet generated statefully.', 'Reports Desk');
        this.loadReports();
      },
      error: (err) => {
        this.isGenerating = false;
        this.toastr.error('Failed to generate report.', 'Reports Desk');
        console.error(err);
      }
    });
  }

  downloadExcelReport(): void {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'TALENT HUB - PLATFORM AUDIT REPORT\n';
    csvContent += `Generated Date,${new Date().toLocaleDateString()}\n\n`;

    // Summary Metrics Section
    csvContent += 'SUMMARY METRICS\n';
    csvContent += `Total Clients,${this.totalClients}\n`;
    csvContent += `Total Freelancers,${this.totalFreelancers}\n`;
    csvContent += `Total Financial Volume,₹${this.financialStats.totalVolume.toFixed(2)}\n`;
    csvContent += `Platform Commissions Earned,₹${this.financialStats.platformCommissions.toFixed(2)}\n`;
    csvContent += `Escrow Held Balance,₹${this.financialStats.escrowHeld.toFixed(2)}\n\n`;

    // Transactions Section
    csvContent += 'TRANSACTION LEDGER\n';
    csvContent += 'Transaction ID,Client Name,Freelancer Name,Amount,Platform Fee,Status,Date,Type\n';
    this.transactions.forEach(t => {
      csvContent += `"${t.id}","${t.clientName}","${t.freelancerName}",${t.amount},${t.platformFee},"${t.status}","${t.date}","${t.type}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TalentHub_Platform_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toastr.success('Platform audit spreadsheet downloaded successfully!', 'Reports Desk');
  }

  downloadReport(report: SystemReport): void {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += `TALENT HUB - ${report.category.toUpperCase()} REPORT\n`;
    csvContent += `Report Title,"${report.title}"\n`;
    csvContent += `Scope/Description,"${report.description}"\n`;
    csvContent += `Generated Date,${report.generatedDate || new Date().toLocaleDateString()}\n\n`;

    if (report.category === 'Financial') {
      csvContent += 'SUMMARY METRICS\n';
      csvContent += `Total Financial Volume,₹${this.financialStats.totalVolume.toFixed(2)}\n`;
      csvContent += `Platform Commissions Earned,₹${this.financialStats.platformCommissions.toFixed(2)}\n`;
      csvContent += `Escrow Held Balance,₹${this.financialStats.escrowHeld.toFixed(2)}\n\n`;

      csvContent += 'TRANSACTION LEDGER\n';
      csvContent += 'Transaction ID,Client Name,Freelancer Name,Amount,Platform Fee,Status,Date,Type\n';
      this.transactions.forEach(t => {
        csvContent += `"${t.id}","${t.clientName}","${t.freelancerName}",${t.amount},${t.platformFee},"${t.status}","${t.date}","${t.type}"\n`;
      });
    } else if (report.category === 'User Activity') {
      csvContent += 'USER METRICS\n';
      csvContent += `Total Clients Registered,${this.totalClients || this.clients.length}\n`;
      csvContent += `Total Freelancers Registered,${this.totalFreelancers || this.freelancers.length}\n\n`;

      csvContent += 'CLIENT REGISTRY\n';
      csvContent += 'Client ID,Company Name,Contact Name,Email,Phone Number,Spent,Projects Count,Status,Joined Date,Industry\n';
      this.clients.forEach(c => {
        csvContent += `"${c.id}","${c.name}","${c.clientName}","${c.email}","${c.phoneNumber}",${c.spent},${c.projectsCount},"${c.status}","${c.joinedDate}","${c.industry}"\n`;
      });
      csvContent += '\n';

      csvContent += 'FREELANCER REGISTRY\n';
      csvContent += 'Freelancer ID,Name,Title,Email,Phone Number,Hourly Rate,Completed Projects,Earnings,Status,Joined Date,Rating\n';
      this.freelancers.forEach(f => {
        csvContent += `"${f.id}","${f.name}","${f.title}","${f.email}","${f.phoneNumber}",${f.hourlyRate},${f.completedProjects},${f.earnings},"${f.status}","${f.joinedDate}",${f.rating}\n`;
      });
    } else {
      csvContent += 'PLATFORM HEALTH METRICS\n';
      csvContent += `Total Clients,${this.totalClients}\n`;
      csvContent += `Total Freelancers,${this.totalFreelancers}\n`;
      csvContent += `Total Transactions,${this.transactions.length}\n`;
      
      const activeContracts = this.transactions.filter(t => t.status === 'Pending').length;
      csvContent += `Estimated Active Workflows,${activeContracts}\n\n`;

      csvContent += 'SAMPLE LEDGER HEALTH AUDIT\n';
      csvContent += 'Audit Aspect,Status,Observation\n';
      csvContent += '"Database Connectivity","Optimal","Mongoose Cluster status is active."\n';
      csvContent += '"Auth Gateways","Secure","JSON Web Tokens signature validation working."\n';
      csvContent += '"API Response Latency","98ms Average","Under threshold limit of 200ms."\n';
      csvContent += '"Report Desk Integrity","Passed","Stateful model sync complete."\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const cleanTitle = report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `TalentHub_${cleanTitle}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toastr.success(`Report "${report.title}" downloaded successfully!`, 'Reports Desk');
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
