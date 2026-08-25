import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Contract } from '../../../core/models/contract.model';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';


declare var window: any;

@Component({
  selector: 'app-manage-contract',
  standalone: true,
  imports: [CommonModule, Table, InputField, Chip, Button],
  templateUrl: './manage-contract.html',
  styleUrl: './manage-contract.css'
})
export class ManageContract implements OnInit {
  allContracts: Contract[] = [];
  isLoading: boolean = true;
  activeFilters: string[] = ['Design', 'Active'];

  @ViewChild('snoTemplate', { static: true }) snoTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('startDateTemplate', { static: true }) startDateTemplate!: TemplateRef<any>;
  @ViewChild('endDateTemplate', { static: true }) endDateTemplate!: TemplateRef<any>;
  @ViewChild('fundsTemplate', { static: true }) fundsTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];

  constructor(
    private contractService: ContractService,
    private transactionService: TransactionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.columns = [
      { field: 'id', headerName: 'S.NO', cellTemplate: this.snoTemplate },
      { field: 'contractTitle', headerName: 'Contract title' },
      { field: 'contractSubject', headerName: 'Subject' },
      { field: 'contractType', headerName: 'Contract Type' },
      { field: 'estimatedBudget', headerName: 'Budget', cellTemplate: this.budgetTemplate },
      { field: 'contractStartDate', headerName: 'Start Date', cellTemplate: this.startDateTemplate },
      { field: 'contractEndDate', headerName: 'End Date', cellTemplate: this.endDateTemplate },
      { field: 'funded', headerName: 'Funds Status', cellTemplate: this.fundsTemplate },
      { field: 'status', headerName: 'Status', cellTemplate: this.statusTemplate },
      { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTemplate }
    ];
    this.fetchContracts();
    this.loadRazorpayScript();
  }

  loadRazorpayScript(): void {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
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
}
