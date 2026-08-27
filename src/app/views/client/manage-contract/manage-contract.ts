import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Contract } from '../../../core/models/contract.model';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';


declare var window: any;

@Component({
  selector: 'app-manage-contract',
  standalone: true,
  imports: [CommonModule, Table, InputField, Chip, Button, Badge, Dropdown],
  templateUrl: './manage-contract.html',
  styleUrl: './manage-contract.css'
})
export class ManageContract implements OnInit, AfterViewInit, OnDestroy {
  allContracts: Contract[] = [];
  isLoading: boolean = true;
  activeFilters: string[] = ['Design', 'Active'];


  dropdownTop: number = 0;
  dropdownLeft: number = 0;

  private scrollListener: any;

  @ViewChild('snoTemplate', { static: true }) snoTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('startDateTemplate', { static: true }) startDateTemplate!: TemplateRef<any>;
  @ViewChild('endDateTemplate', { static: true }) endDateTemplate!: TemplateRef<any>;
  @ViewChild('fundsTemplate', { static: true }) fundsTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('createdAtTemplate', { static: true }) createdAtTemplate!: TemplateRef<any>;
  @ViewChild('spentTemplate', { static: true }) spentTemplate!: TemplateRef<any>;
  @ViewChild('feedbackStatusTemplate', { static: true }) feedbackStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [
    { field: 'sno', headerName: 'S.NO' },
    { field: 'contractTitle', headerName: 'Contract title' },
    { field: 'contractSubject', headerName: 'Subject' },
    { field: 'contractType', headerName: 'Contract Type' },
    { field: 'estimatedBudget', headerName: 'Budget' },
    { field: 'contractStartDate', headerName: 'Start Date' },
    { field: 'contractEndDate', headerName: 'End Date' },
    { field: 'createdAt', headerName: 'Created On' },
    { field: 'spent', headerName: 'Spent' },
    { field: 'funded', headerName: 'Funds Status' },
    { field: 'status', headerName: 'Status' },
    { field: 'feedbackStatus', headerName: 'Feedback Status' },
    { field: 'actions', headerName: 'Actions' }
  ];

  constructor(
    private contractService: ContractService,
    private transactionService: TransactionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchContracts();
    this.loadRazorpayScript();

  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, true);
    }
  }


  getDropdownItems(row: Contract): DropdownItem[] {
    const items: DropdownItem[] = [
      { label: 'Applicants', value: 'applicants', icon: 'bi bi-people' },
      { label: 'Contract Progress', value: 'progress', icon: 'bi bi-graph-up' },
      { label: 'Edit', value: 'edit', icon: 'bi bi-pencil' }
    ];

    if (row.status?.toLowerCase() === 'completed' && !(row as any).feedbackSubmitted) {
      items.push({ label: 'Submit Feedback', value: 'feedback', icon: 'bi bi-star' });
    }

    if (!this.isFullyFunded(row)) {
      items.push({ label: 'Fund Contract', value: 'fund', icon: 'bi bi-credit-card' });
    }

    items.push({ label: 'Delete', value: 'delete', icon: 'bi bi-trash', className: 'dropdown-item-danger' });

    return items;
  }

  onDropdownAction(item: DropdownItem, row: Contract): void {

    switch (item.value) {
      case 'applicants':
        this.viewApplicants(row._id);
        break;
      case 'progress':
        this.viewContractProgress(row._id);
        break;
      case 'edit':
        this.editContract(row._id);
        break;
      case 'fund':
        this.fundContract(row);
        break;
      case 'feedback':
        this.router.navigate(['/submit-feedback', row._id]);
        break;
      case 'delete':
        this.deleteContract(row._id);
        break;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns[0].cellTemplate = this.snoTemplate;
      this.columns[4].cellTemplate = this.budgetTemplate;
      this.columns[5].cellTemplate = this.startDateTemplate;
      this.columns[6].cellTemplate = this.endDateTemplate;
      this.columns[7].cellTemplate = this.createdAtTemplate;
      this.columns[8].cellTemplate = this.spentTemplate;
      this.columns[9].cellTemplate = this.fundsTemplate;
      this.columns[10].cellTemplate = this.statusTemplate;
      // feedbackStatus template needs to be created in HTML and referenced
      this.columns[11].cellTemplate = (this as any).feedbackStatusTemplate;
      this.columns[12].cellTemplate = this.actionsTemplate;
    });
  }

  removeFilter(filterToRemove: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filterToRemove);
  }

  fetchContracts(): void {
    this.isLoading = true;
    this.contractService.getMyContracts().subscribe({
      next: (res) => {
        this.allContracts = res.contracts || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contracts:', err);
        this.isLoading = false;
      }
    });
  }

  isFullyFunded(contract: Contract): boolean {
    return !!(contract.funded && contract.funded > 0);
  }

  getBadgeVariant(status: string): 'success' | 'primary' | 'secondary' | 'warning' | 'danger' | 'info' | 'purple' {
    const s = status?.toLowerCase() || '';
    if (s === 'completed' || s === 'closed') return 'success';
    if (s === 'open' || s === 'in progress' || s === 'active') return 'primary';
    if (s === 'draft') return 'secondary';
    return 'primary';
  }




  viewApplicants(id: string): void {
    this.router.navigate(['/applicants', id]);
  }

  viewContractProgress(id: string): void {
    this.router.navigate(['/contract-progress', id]);
  }

  editContract(id: string): void {
    this.router.navigate(['/create-contract'], { queryParams: { id } });
  }

  navigateToCreateContract(): void {
    this.router.navigate(['/create-contract']);
  }


  deleteContract(id: string): void {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contractService.deleteContract(id).subscribe({
        next: () => {
          this.allContracts = this.allContracts.filter(c => c._id !== id);
        },
        error: (err) => console.error('Delete error', err)
      });
    }
  }





  loadRazorpayScript(): void {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }



  fundContract(contract: Contract): void {
    if (this.isFullyFunded(contract)) {
      alert("This contract is already fully funded.");
      return;
    }

    const baseAmount = contract.estimatedBudget;
    const amount = Math.round(baseAmount * 1.10); // Add 10% platform fee

    this.transactionService.createRazorpayOrder({ amount }).subscribe({
      next: (res) => {
        if (res.success && res.order) {
          this.initiateRazorpayCheckout(res.order, res.keyId, amount, contract._id);
        } else {
          alert("Failed to create payment order. " + res.message);
        }
      },
      error: (err) => {
        console.error("Payment error:", err);
        alert("Failed to initialize payment.");
      }
    });
  }

  initiateRazorpayCheckout(order: any, keyId: string, amount: number, contractId: string): void {
    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: "TalentHub",
      description: "Contract Escrow Funding",
      order_id: order.id,
      handler: (response: any) => {
        // Verification phase
        const verifyPayload = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          amount: amount,
          contractId: contractId
        };

        this.transactionService.verifyRazorpayPayment(verifyPayload).subscribe({
          next: (verifyRes) => {
            if (verifyRes.success) {
              alert("Payment successful! Redirecting to Financial Summary.");
              this.router.navigate(['/financial-summary']);
            } else {
              alert("Payment verification failed.");
            }
          },
          error: (err) => {
            console.error("Verification error", err);
            alert("Payment verification encountered an error.");
          }
        });
      },
      theme: {
        color: "#0d6efd"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }


}
