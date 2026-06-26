import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { CreateContractDTO, UpdateContractDTO } from '../../../../../core/DTOs/contract.dto';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CONTRACT_STATUS_OPTIONS, BUDGET_TYPE_OPTIONS, CONTRACT_TYPE_OPTIONS, CONTRACT_SUBJECT_OPTIONS } from '../../../../../core/constants/contract-options.constant';
import { ContractStatusEnum, BudgetTypeEnum } from '../../../../../core/enums/contract.enum';
import { dateRangeValidator } from '../../../../../core/helpers/date-range.validator';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent, RichTextEditorComponent, RouterLink,],
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.css',
})
export class ContractFormComponent implements OnInit {

  mode = signal<'create' | 'edit'>('create');
  contractId = signal<string>('');
  loading = signal<boolean>(false);

  destroyRef = inject(DestroyRef);
  toastr = inject(ToastrService);

  statusOptions = CONTRACT_STATUS_OPTIONS;
  budgetTypeOptions = BUDGET_TYPE_OPTIONS;
  contractTypeOptions = CONTRACT_TYPE_OPTIONS;
  contractSubjectOptions = CONTRACT_SUBJECT_OPTIONS;

  contractForm!: FormGroup;

  constructor(private fb: FormBuilder, private contractService: ContractService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.mode.set('edit');
        this.contractId.set(id);
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
    }, { validators: dateRangeValidator });
  }

  getContractDetails(): void {
    this.loading.set(true);
    this.contractService.getMyContractById(this.contractId()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastr.error('Failed to load contract details', 'Error');
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

    this.loading.set(true);
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
    if (this.mode() === 'create') {
      this.contractService.createContract(payload as CreateContractDTO).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.loading.set(false);
          this.toastr.success('Contract created successfully!', 'Success');
          this.contractForm.reset();
          this.contractForm.patchValue({
            budgetType: 'Fixed Price',
            status: 'pending',
            contractType: '',
            contractSubject: '',
          });
          this.router.navigate(['/user/your-contracts']);
        },
        error: () => {
          this.loading.set(false);
          this.toastr.error('Failed to create contract.', 'Error');
        },
      });
    }
    else {
      this.contractService.updateContract(this.contractId(), payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.loading.set(false);
          this.toastr.success('Contract updated successfully!', 'Success');
          this.router.navigate(['/user/your-contracts']);
        },
        error: () => {
          this.loading.set(false);
          this.toastr.error('Failed to update contract.', 'Error');
        },
      });
    }
  }

  get f() {
    return this.contractForm.controls;
  }
}
