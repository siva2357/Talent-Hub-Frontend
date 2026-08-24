import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';

@Component({
  selector: 'app-create-phase',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './create-phase.html',
  styleUrl: './create-phase.css'
})
export class CreatePhase implements OnInit {
  contractId: string = '';
  contract: any = null;
  diaryId: string = '';
  phaseId: string | null = null;
  isEditMode: boolean = false;

  phaseForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diaryService: ContractDiaryService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id') || '';
      
      // Check query params for phaseId
      this.route.queryParamMap.subscribe(queryParams => {
        this.phaseId = queryParams.get('phaseId');
        this.isEditMode = !!this.phaseId;
        
        if (this.contractId) {
          this.fetchContractDetails();
        }
      });
    });
  }

  initForm(): void {
    this.phaseForm = this.fb.group({
      phaseName: ['', [Validators.required, Validators.maxLength(100)]],
      deadline: ['', Validators.required],
      budget: [null, [Validators.required, Validators.min(1)]],
      deliverables: this.fb.array([]),
      acceptanceCriteria: this.fb.array([])
    });
    this.addDeliverable();
    this.addCriteria();
  }

  get deliverables(): FormArray {
    return this.phaseForm.get('deliverables') as FormArray;
  }

  get acceptanceCriteria(): FormArray {
    return this.phaseForm.get('acceptanceCriteria') as FormArray;
  }

  addDeliverable(): void {
    this.deliverables.push(this.fb.control('', Validators.required));
  }

  removeDeliverable(index: number): void {
    this.deliverables.removeAt(index);
    if (this.deliverables.length === 0) {
      this.addDeliverable();
    }
  }

  addCriteria(): void {
    this.acceptanceCriteria.push(this.fb.control('', Validators.required));
  }

  removeCriteria(index: number): void {
    this.acceptanceCriteria.removeAt(index);
    if (this.acceptanceCriteria.length === 0) {
      this.addCriteria();
    }
  }

  resetForm(): void {
    this.phaseForm.reset();
    this.deliverables.clear();
    this.acceptanceCriteria.clear();
    this.addDeliverable();
    this.addCriteria();
  }

  fetchContractDetails(): void {
    this.diaryService.getDiaryByContractId(this.contractId).subscribe({
      next: (res) => {
        if(res.success && res.diary) {
          this.diaryId = res.diary._id;
          this.contract = res.diary.contractId; 
          
          if (this.isEditMode && this.phaseId) {
            const phase = res.diary.phases.find((p: any) => p._id === this.phaseId);
            if (phase) {
              this.patchForm(phase);
            }
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  patchForm(phase: any): void {
    const deadline = phase.deadline ? new Date(phase.deadline).toISOString().split('T')[0] : '';
    this.phaseForm.patchValue({
      phaseName: phase.name,
      deadline: deadline,
      budget: phase.amount
    });

    // Clear initial arrays
    this.deliverables.clear();
    this.acceptanceCriteria.clear();

    // In a real implementation we would patch the deliverables/criteria, 
    // but the backend only stores description right now for phase updates.
    // However, if the backend stored arrays, we'd loop and push controls here.
    // We'll just put placeholder if empty or just 1 item since we modified backend 
    // to just take name, deadline, amount.
    this.addDeliverable();
    this.addCriteria();
  }

  createPhase(): void {
    if (this.phaseForm.invalid) {
      this.phaseForm.markAllAsTouched();
      alert("Please fill in all required fields (Name, Deadline, Budget).");
      return;
    }

    const formVal = this.phaseForm.value;
    const payload = {
      name: formVal.phaseName,
      description: "Phase details setup by client", 
      amount: formVal.budget,
      deadline: formVal.deadline,
      deliverables: formVal.deliverables.filter((d: string) => d?.trim() !== ''),
      acceptanceCriteria: formVal.acceptanceCriteria.filter((c: string) => c?.trim() !== '')
    };

    if (this.isEditMode && this.phaseId) {
      this.diaryService.updatePhase(this.diaryId, this.phaseId, payload).subscribe({
        next: (res) => {
          if(res.success) {
            this.router.navigate(['/contract-progress', this.contractId]);
          } else {
            alert('Failed to update phase.');
          }
        },
        error: (err) => console.error(err)
      });
    } else {
      this.diaryService.addPhase(this.diaryId, payload).subscribe({
        next: (res) => {
          if(res.success) {
            this.router.navigate(['/contract-progress', this.contractId]);
          } else {
            alert('Failed to create phase.');
          }
        },
        error: (err) => console.error(err)
      });
    }
  }
}

