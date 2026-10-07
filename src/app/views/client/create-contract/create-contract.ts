
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ContractService } from '../../../core/services/contract.service';
import { CreateContractDto } from '../../../core/dtos/contract.dto';

import {
  InputField,
  InputOption
} from '../../../library/ui/components/input-field/input-field';

import { Button } from '../../../library/ui/components/button/button';

import { ToastService } from '../../../core/services/ui/toast.service';
import { ValidationPatterns } from '../../../core/helpers/validation-pattern';
import { MasterDataService } from '../../../core/services/master-data.service';


@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputField,
    Button
  ],
  templateUrl: './create-contract.html',
  styleUrl: './create-contract.css'
})
export class CreateContract implements OnInit {

  contractForm!: FormGroup;

  isSubmitting = false;
  isLoading = false;

  editContractId!: string;

  // =========================================================
  // MASTER DATA OPTIONS
  // =========================================================

  contractTypeOptions: InputOption[] = [];

  contractCategoryOptions: InputOption[] = [];

  contractSubjectOptions: InputOption[] = [];

  contractStatusOptions: InputOption[] = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService,
    private toastService: ToastService,
    private masterDataService: MasterDataService
  ) { }


  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {

    this.initForm();

    this.loadContractMasterData();

    this.route.queryParams.subscribe(params => {

      if (params['id']) {

        this.editContractId = params['id'];

        this.loadContractData(this.editContractId);
      }

    });
  }


  // =========================================================
  // LOAD MASTER DATA
  // =========================================================

  loadContractMasterData(): void {

    this.masterDataService
      .getAllMasterData()
      .subscribe({

        next: (response) => {

          const masterData = response?.data;

          if (!masterData) {

            console.error(
              'Master data response is empty.'
            );

            this.toastService.show(
              'Master data could not be loaded.',
              'error'
            );

            return;
          }


          // Contract Types
          this.contractTypeOptions =
            this.mapMasterDataOptions(
              masterData.ContractTypes
            );


          // Contract Categories
          this.contractCategoryOptions =
            this.mapMasterDataOptions(
              masterData.ContractCategories
            );


          // Contract Subjects
          this.contractSubjectOptions =
            this.mapMasterDataOptions(
              masterData.ContractSubjects
            );


          // Contract Status
          this.contractStatusOptions =
            this.mapMasterDataOptions(
              masterData.ContractStatus
            );
        },


        error: (error) => {

          console.error(
            'Failed to load contract master data:',
            error
          );

          this.toastService.show(
            'Failed to load contract master data.',
            'error'
          );
        }

      });
  }


  // =========================================================
  // MAP MASTER DATA TO INPUT OPTIONS
  // =========================================================

  private mapMasterDataOptions(
    options: any[] = []
  ): InputOption[] {

    return options.map(option => ({
      label: option.value,
      value: option.key
    }));
  }


  // =========================================================
  // LOAD CONTRACT FOR EDIT
  // =========================================================

  loadContractData(id: string): void {

    this.isLoading = true;

    this.contractService
      .getClientContractById(id)
      .subscribe({

        next: (res) => {

          this.isLoading = false;


          if (
            res.success &&
            res.contract
          ) {

            const c = res.contract;


            this.contractForm.patchValue({

              contractTitle:
                c.contractTitle,

              contractType:
                c.contractType,

              contractCategory:
                c.contractCategory || '',

              contractSubject:
                c.contractSubject,

              contractDescription:
                c.contractDescription,

              contractStartDate:
                c.contractStartDate
                  ? new Date(
                    c.contractStartDate
                  )
                    .toISOString()
                    .split('T')[0]
                  : '',

              contractEndDate:
                c.contractEndDate
                  ? new Date(
                    c.contractEndDate
                  )
                    .toISOString()
                    .split('T')[0]
                  : '',

              status:
                c.status,

              estimatedBudget:
                c.estimatedBudget,

              currency:
                c.currency || 'INR',

              agreeToTerms1:
                true,

              agreeToTerms2:
                true,

              agreeToTerms3:
                true
            });
          }
        },


        error: (error) => {

          this.isLoading = false;

          console.error(
            'Error fetching contract:',
            error
          );

          this.toastService.show(
            'Failed to load contract data.',
            'error'
          );
        }

      });
  }


  // =========================================================
  // INITIALIZE FORM
  // =========================================================

  initForm(): void {

    this.contractForm =
      this.fb.group({

        contractTitle: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.pattern(
              ValidationPatterns.textNumberSpecialChar
            )
          ]
        ],


        contractType: [
          '',
          Validators.required
        ],


        contractCategory: [
          '',
          Validators.required
        ],


        contractSubject: [
          '',
          Validators.required
        ],


        contractDescription: [
          '',
          Validators.required
        ],


        contractStartDate: [
          '',
          Validators.required
        ],


        contractEndDate: [
          '',
          Validators.required
        ],


        status: [
          'draft'
        ],


        agreeToTerms1: [
          false,
          Validators.requiredTrue
        ],


        agreeToTerms2: [
          false,
          Validators.requiredTrue
        ],


        agreeToTerms3: [
          false,
          Validators.requiredTrue
        ],


        estimatedBudget: [
          null,
          [
            Validators.required,
            Validators.min(30000),
            Validators.max(75000),
            Validators.pattern(/^[0-9]+$/)
          ]
        ],


        currency: [
          'INR',
          Validators.required
        ]

      });
  }


  // =========================================================
  // CONTRACT DURATION
  // =========================================================

  get durationDetails(): {
    totalDays: number;
    workingDays: number;
    weeks: number;
    approxMonths: number;
  } {

    const start =
      this.contractForm
        .get('contractStartDate')
        ?.value;


    const end =
      this.contractForm
        .get('contractEndDate')
        ?.value;


    if (!start || !end) {

      return {
        totalDays: 0,
        workingDays: 0,
        weeks: 0,
        approxMonths: 0
      };
    }


    const startDate =
      new Date(start);

    const endDate =
      new Date(end);


    if (endDate < startDate) {

      return {
        totalDays: 0,
        workingDays: 0,
        weeks: 0,
        approxMonths: 0
      };
    }


    const timeDiff =
      endDate.getTime() -
      startDate.getTime();


    const totalDays =
      Math.ceil(
        timeDiff /
        (1000 * 3600 * 24)
      ) + 1;


    let workingDays = 0;


    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(
        d.getDate() + 1
      )
    ) {

      if (
        d.getDay() !== 0 &&
        d.getDay() !== 6
      ) {

        workingDays++;
      }
    }


    const weeks =
      Math.ceil(
        totalDays / 7
      );


    const approxMonths =
      Math.round(
        (totalDays / 30) * 10
      ) / 10;


    return {
      totalDays,
      workingDays,
      weeks,
      approxMonths
    };
  }


  // =========================================================
  // SUBMIT CONTRACT
  // =========================================================

  submitContract(): void {

    // -------------------------------------------------------
    // Validate form
    // -------------------------------------------------------

    if (this.contractForm.invalid) {

      this.contractForm.markAllAsTouched();

      this.toastService.show(
        'Please complete all required fields correctly.',
        'warning'
      );

      return;
    }


    // -------------------------------------------------------
    // Start submission
    // -------------------------------------------------------

    this.isSubmitting = true;


    const payload: any = {
      ...this.contractForm.value
    };


    // -------------------------------------------------------
    // Convert dates to ISO format
    // -------------------------------------------------------

    payload.contractStartDate =
      new Date(
        payload.contractStartDate
      ).toISOString();


    payload.contractEndDate =
      new Date(
        payload.contractEndDate
      ).toISOString();


    // -------------------------------------------------------
    // Remove frontend-only agreement fields
    // -------------------------------------------------------

    delete payload.agreeToTerms1;

    delete payload.agreeToTerms2;

    delete payload.agreeToTerms3;


    // =======================================================
    // UPDATE CONTRACT
    // =======================================================

    if (this.editContractId) {

      this.contractService
        .updateContract(
          this.editContractId,
          payload
        )
        .subscribe({

          next: () => {

            this.isSubmitting = false;


            this.toastService.show(
              'Contract updated successfully!',
              'success'
            );


            this.router.navigate([
              '/manage-contract'
            ]);
          },


          error: (error) => {

            this.isSubmitting = false;


            console.error(
              'Error updating contract:',
              error
            );


            this.toastService.show(
              error.error?.message ||
              'Failed to update contract',
              'error'
            );
          }

        });


      return;
    }


    // =======================================================
    // CREATE CONTRACT
    // =======================================================

    this.contractService
      .createContract(
        payload as CreateContractDto
      )
      .subscribe({

        next: () => {

          this.isSubmitting = false;


          this.toastService.show(
            'Contract created successfully!',
            'success'
          );


          this.router.navigate([
            '/manage-contract'
          ]);
        },


        error: (error) => {

          this.isSubmitting = false;


          console.error(
            'Error creating contract:',
            error
          );


          this.toastService.show(
            error.error?.message ||
            'Failed to create contract',
            'error'
          );
        }

      });
  }
}
