import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
@Component({
  selector: 'app-update-basic-details',
  standalone: true,
  templateUrl: './update-basic-details.html',
  styleUrl: './update-basic-details.css',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class UpdateBasicDetails implements OnInit {

  basicDetailsForm!: FormGroup;

  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  successMessage = '';

  recruiterProfile!: any;

  constructor(
    private fb: FormBuilder,
    private profileService:SeekerProfileService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBasicProfile();
  }

  /* ================= FORM ================= */
  initForm(): void {
    this.basicDetailsForm = this.fb.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],

      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      gender: ['', Validators.required],
      bioDescription: ['', Validators.required]
    });
  }

  /* ================= LOAD PROFILE ================= */
  loadBasicProfile(): void {
    this.isLoading = true;

    this.profileService.getJobSeekerBasicDetails().subscribe({
      next: (res) => {
        if (res.success) {
          this.recruiterProfile = res.data;

          this.basicDetailsForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            mobile: res.data.mobile,
            gender: res.data.gender,
            bioDescription: res.data.bioDescription
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load profile';
        this.isLoading = false;
      }
    });
  }

  /* ================= UPDATE ================= */
  updateProfile(): void {
    if (this.basicDetailsForm.invalid) {
      this.basicDetailsForm.markAllAsTouched();
      return;
    }

    const payload = {
      mobile: this.basicDetailsForm.value.mobile,
      gender: this.basicDetailsForm.value.gender,
      bioDescription: this.basicDetailsForm.value.bioDescription
    };

    this.isUpdating = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.profileService.updateJobSeekerBasicDetails(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Profile updated successfully';
          this.loadBasicProfile();
          this.basicDetailsForm.markAsPristine();
        }
        this.isUpdating = false;
      },
      error: () => {
        this.errorMessage = 'Update failed';
        this.isUpdating = false;
      }
    });
  }

  /* ================= DISCARD ================= */
  discard(): void {
    if (!this.recruiterProfile) return;

    this.basicDetailsForm.patchValue({
      firstName: this.recruiterProfile.firstName,
      lastName: this.recruiterProfile.lastName,
      email: this.recruiterProfile.email,
      mobile: this.recruiterProfile.mobile,
      gender: this.recruiterProfile.gender,
      bioDescription: this.recruiterProfile.bioDescription
    });

    this.basicDetailsForm.markAsPristine();
    this.basicDetailsForm.markAsUntouched();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
