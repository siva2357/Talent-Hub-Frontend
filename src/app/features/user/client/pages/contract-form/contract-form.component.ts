import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { CreateContractDTO, UpdateContractDTO } from '../../../../../core/DTOs/contract.dto';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CONTRACT_STATUS_OPTIONS, BUDGET_TYPE_OPTIONS, CONTRACT_TYPE_OPTIONS, CONTRACT_SUBJECT_OPTIONS } from '../../../../../core/constants/contract-options.constant';
import { ContractStatusEnum, BudgetTypeEnum } from '../../../../../core/enums/contract.enum';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    RichTextEditorComponent,
    RouterLink,
  ],
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.css',
})
export class ContractFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() contractId: string = '';

  loading: boolean = false;
  statusOptions = CONTRACT_STATUS_OPTIONS;
  budgetTypeOptions = BUDGET_TYPE_OPTIONS;
  contractTypeOptions = CONTRACT_TYPE_OPTIONS;
  contractSubjectOptions = CONTRACT_SUBJECT_OPTIONS;
  contractForm!: FormGroup;

  constructor( private fb: FormBuilder, private contractService: ContractService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.mode = 'edit';
        this.contractId = id;
        this.getContractDetails();
      }
    });
  }

  initializeForm(): void {
    this.contractForm = this.fb.group({
      contractTitle: ['', [Validators.required, Validators.minLength(5)]],
      budgetType: [BudgetTypeEnum.FIXED_PRICE, Validators.required],
      estimatedBudget: [null, [Validators.required, Validators.min(25000), Validators.max(75000)]],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['', Validators.required],
      contractDescription: ['', Validators.required],
      contractType: ['', Validators.required],
      contractSubject: ['', Validators.required],
      status: [ContractStatusEnum.PENDING, Validators.required],
    });
  }

  getContractDetails(): void {
    this.loading = true;
    this.contractService.getMyContractById(this.contractId).subscribe({
      next: (response) => {
        this.contractForm.patchValue({
          contractTitle: response.contract.contractTitle,
          budgetType: response.contract.budgetType,
          estimatedBudget: response.contract.estimatedBudget,
          contractStartDate: this.formatDate(response.contract.contractStartDate),
          contractEndDate: this.formatDate(response.contract.contractEndDate),
          contractDescription: response.contract.contractDescription,
          contractType: response.contract.contractType,
          contractSubject: response.contract.contractSubject,
          status: response.contract.status,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.contractForm.invalid) {
      this.contractForm.markAllAsTouched();
      return;
    }

    const startDate = new Date(this.contractForm.value.contractStartDate);
    const endDate = new Date(this.contractForm.value.contractEndDate);
    if (endDate < startDate) {
      alert('End date must be greater than start date');
      return;
    }

    const minEndDate = new Date(startDate);
    minEndDate.setMonth(minEndDate.getMonth() + 2);
    if (endDate < minEndDate) {
      alert('Contract duration must be at least 2 months');
      return;
    }
    this.loading = true;
    const payload: CreateContractDTO | UpdateContractDTO = {
      contractTitle: this.contractForm.value.contractTitle,
      budgetType: this.contractForm.value.budgetType,
      estimatedBudget: this.contractForm.value.estimatedBudget,
      contractStartDate: this.contractForm.value.contractStartDate,
      contractEndDate: this.contractForm.value.contractEndDate,
      contractDescription: this.contractForm.value.contractDescription,
      contractType: this.contractForm.value.contractType,
      contractSubject: this.contractForm.value.contractSubject,
      status: this.contractForm.value.status,
    };

    // CREATE
    if (this.mode === 'create') {
      this.contractService.createContract(payload as CreateContractDTO).subscribe({
        next: () => {
          this.loading = false;
          this.contractForm.reset();
          this.contractForm.patchValue({
            budgetType: 'Fixed Price',
            status: 'pending',
            contractType: '',
            contractSubject: '',
          });
          // REDIRECT
          this.router.navigate(['/user/your-contracts']);
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.contractService.updateContract(this.contractId, payload).subscribe({
        next: () => {
          this.loading = false;
          // REDIRECT
          this.router.navigate(['/user/your-contracts']);
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  get f() {
    return this.contractForm.controls;
  }
}
