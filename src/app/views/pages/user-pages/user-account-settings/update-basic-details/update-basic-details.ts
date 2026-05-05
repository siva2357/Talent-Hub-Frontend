import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';
import { InputFields } from '../../../../components/input-fields/input-fields';
import { Buttons } from '../../../../components/buttons/buttons';

@Component({
  selector: 'app-update-basic-details',
  standalone: true,
  templateUrl: './update-basic-details.html',
  styleUrl: './update-basic-details.css',
  imports: [CommonModule, ReactiveFormsModule, InputFields, Buttons],
})
export class UpdateBasicDetails implements OnInit {
  role: string | null = null;
  form!: FormGroup;
  isLoading = false;
  isSaving = false;

  constructor(
    private authService: AuthService,
    private seekerService: SeekerProfileService,
    private recruiterService: RecruiterProfileService,
    public fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      bioDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.loadBasicDetails();
  }

  loadBasicDetails(): void {
    this.isLoading = true;
    const service = this.role === 'jobSeeker' ? this.seekerService : this.recruiterService;
    
    // Both services have similar methods based on the response snippets provided
    const obs = (this.role === 'jobSeeker' 
      ? this.seekerService.getJobSeekerBasicDetails() 
      : this.recruiterService.getRecruiterBasicDetails()) as Observable<any>;

    obs.subscribe({
      next: (res: any) => {
        this.form.patchValue(res.data);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  updateProfile(): void {
    if (this.form.invalid) return;
    
    this.isSaving = true;
    const payload = this.form.getRawValue();
    
    const obs = (this.role === 'jobSeeker'
      ? this.seekerService.updateJobSeekerBasicDetails(payload)
      : this.recruiterService.updateRecruiterBasicDetails(payload)) as Observable<any>;

    obs.subscribe({
      next: () => {
        this.isSaving = false;
        // Trigger success feedback
      },
      error: () => (this.isSaving = false),
    });
  }
}
