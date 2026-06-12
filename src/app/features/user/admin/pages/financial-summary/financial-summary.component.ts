import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, TransactionData } from '../../../../../core/services/admin.service';
import { TableColumn } from '../../../../../core/model/table.interface';
import { Table } from "../../../../../shared/components/table/table.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import {FormsModule} from '@angular/forms';




@Component({
  selector: 'app-admin-financial-summary',
  standalone: true,
  imports: [CommonModule, Table, InputComponent, FormsModule],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class AdminFinancialSummaryComponent implements OnInit {
  private adminService = inject(AdminService);

  transactions: TransactionData[] = [];
  filteredTransactions: TransactionData[] = [];
  columns: TableColumn[] = [];
  // Ledger stats
  financialStats = {
    totalVolume: 0,
    platformCommissions: 0,
    escrowHeld: 0,
    growthPercent: 0
  };

  searchTerm = '';
  statusFilter: 'All' | 'Completed' | 'In Progress' | 'Pending' = 'All';


  @ViewChild('paymentTemplate', { static: true })
paymentTemplate!: TemplateRef<any>;

@ViewChild('freelancerPaymentTemplate', { static: true })
freelancerPaymentTemplate!: TemplateRef<any>;

@ViewChild('commissionTemplate', { static: true })
commissionTemplate!: TemplateRef<any>;

@ViewChild('statusTemplate', { static: true })
statusTemplate!: TemplateRef<any>;


ngOnInit(): void {
  this.initializeColumns();
  this.loadFinancials();
}
  loadFinancials(): void {
    // Load ledger stats
    this.adminService.getFinancialStats().subscribe({
      next: (stats) => {
        this.financialStats = stats;
      }
    });

    // Load detailed transactions (contracts data)
    this.adminService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

onFilterStatus(status: string): void {
  this.statusFilter = status as any;
  this.applyFilters();
}


  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = t.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            t.freelancerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            (t.contractTitle || '').toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'All' || t.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }




  statusOptions = [
  {
    label: 'All Contracts',
    value: 'All'
  },
  {
    label: 'In Progress',
    value: 'In Progress'
  },
  {
    label: 'Completed',
    value: 'Completed'
  },
  {
    label: 'Pending',
    value: 'Pending'
  }
];



initializeColumns(): void {
  this.columns = [
    {
      name: 'S.No',
      prop: 'index',
      width: 60,
      sortable: false
    },
    {
      name: 'Contract',
      prop: 'contractTitle',
      width: 280
    },
    {
      name: 'Client',
      prop: 'clientName',
      width: 180
    },
    {
      name: 'Freelancer',
      prop: 'freelancerName',
      width: 180
    },
    {
      name: 'Client Payment',
      prop: 'budget',
      width: 180,
      cellTemplate: this.paymentTemplate
    },
    {
      name: 'Freelancer Payment',
      prop: 'freelancerPayment',
      width: 180,
      cellTemplate: this.freelancerPaymentTemplate
    },
    {
      name: 'Commission',
      prop: 'commission',
      width: 180,
      cellTemplate: this.commissionTemplate
    },
    {
      name: 'Status',
      prop: 'status',
      width: 140,
      cellTemplate: this.statusTemplate
    }
  ];
}
}
