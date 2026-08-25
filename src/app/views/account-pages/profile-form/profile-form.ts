import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { Router } from '@angular/router';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { Timeline, TimelineStep } from '../../../library/shared/components/timeline/timeline';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField, Button, FileUpload, FilePreview, Timeline],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css'
})
export class ProfileForm implements OnInit {
  role: string = '';
  currentStep: number = 1; // 1: Basic, 2: Professional, 3: Social, 4: Review, 5: Success
  isLoading = false;
  isUploadingPhoto = false;
  previewUrl: string | null = null;
  errorMessage = '';

  UploadBucket = UploadBucket;
  UploadSection = UploadSection;

  profileForm!: FormGroup;

  constructor(
    private tokenService: TokenService,
    private profileService: ProfileService,
    private fileService: FileService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  get timelineSteps(): TimelineStep[] {
    return [
      {
        title: 'Basic information',
        status: this.currentStep > 1 ? 'completed' : this.currentStep === 1 ? 'active' : 'upcoming'
      },
      {
        title: this.role === 'client' ? 'Company Information' : 'Professional information',
        status: this.currentStep > 2 ? 'completed' : this.currentStep === 2 ? 'active' : 'upcoming'
      },
      {
        title: 'Social profile',
        status: this.currentStep > 3 ? 'completed' : this.currentStep === 3 ? 'active' : 'upcoming'
      },
      {
        title: 'Review',
        status: this.currentStep > 4 ? 'completed' : this.currentStep === 4 ? 'active' : 'upcoming'
      }
    ];
  }

  onTimelineStepClicked(index: number): void {
    this.currentStep = index + 1;
  }

  ngOnInit(): void {
    const userRole = this.tokenService.getRole();
    if (userRole) {
      this.role = userRole.toLowerCase(); // 'client' or 'freelancer'
      this.initForm();

      this.isLoading = true;
      this.profileService.getMyProfile().subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.user) {
            this.profileForm.get('basicInformation')?.patchValue({
              fullName: res.user.fullName || '',
              email: res.user.email || ''
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Failed to load user details for pre-fill', err);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  initForm(): void {
    let professionalDetails: FormGroup;

    if (this.role === 'client') {
      professionalDetails = this.fb.group({
        companyType: ['', Validators.required],
        website: ['', [Validators.required, Validators.pattern('https?://.+')]],
        industry: ['', Validators.required],
        companyDescription: ['', [Validators.required, Validators.minLength(10)]]
      });
    } else {
      professionalDetails = this.fb.group({
        professionalHeadline: ['', [Validators.required, Validators.minLength(5)]],
        skills: [[], Validators.required],
        technologies: [[], Validators.required],
        availability: ['', Validators.required]
      });
    }

    this.profileForm = this.fb.group({
      basicInformation: this.fb.group({
        profilePhoto: [''],
        fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$')]],
        gender: ['', Validators.required],
        shortBio: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
      }),
      professionalDetails: professionalDetails,
      location: this.fb.group({
        country: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
      }),
      socialLinks: this.fb.array([]),
      languages: this.fb.array([])
    });
  }

  getValidationState(controlName: string, groupName: string = 'basicInformation'): 'success' | 'error' | 'none' {
    const group = this.profileForm.get(groupName);
    const control = group?.get(controlName);
    if (!control || !control.touched) return 'none';
    return control.valid ? 'success' : 'error';
  }

  getErrorMessage(controlName: string, groupName: string = 'basicInformation'): string {
    const group = this.profileForm.get(groupName);
    const control = group?.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${controlName.charAt(0).toUpperCase() + controlName.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`;
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
    if (control.errors['pattern']) {
      if (controlName === 'phoneNumber') return 'Please enter a valid phone number';
      if (controlName === 'website') return 'Please enter a valid URL (e.g., https://example.com)';
    }
    return 'Invalid input';
  }

  get socialLinks() {
    return this.profileForm.get('socialLinks') as FormArray;
  }

  get languages() {
    return this.profileForm.get('languages') as FormArray;
  }

  nextStep() {
    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  onPhotoSelected(file: File): void {
    if (file) {
      // Show local preview immediately before upload finishes
      const reader = new FileReader();
      reader.onload = e => {
        if (typeof reader.result === 'string') {
          this.previewUrl = reader.result;
        }
      };
      reader.readAsDataURL(file);
      this.errorMessage = '';
    }
  }

  onUploadComplete(url: string): void {
    this.profileForm.get('basicInformation.profilePhoto')?.setValue(url);
    this.previewUrl = null;
  }

  onUploadError(error: string): void {
    this.errorMessage = error;
    // reset preview since upload failed
    this.previewUrl = null;
  }

  onEditPhoto(): void {
    this.previewUrl = null;
    this.profileForm.get('basicInformation.profilePhoto')?.setValue('');
  }

  newSocialPlatform = '';
  newSocialUrl = '';
  newLanguage = '';
  newProficiency = '';

  addSocial(): void {
    if (this.newSocialPlatform && this.newSocialUrl) {
      this.socialLinks.push(this.fb.group({
        platform: [this.newSocialPlatform],
        profileUrl: [this.newSocialUrl]
      }));
      this.newSocialPlatform = '';
      this.newSocialUrl = '';
    }
  }

  removeSocial(index: number): void {
    this.socialLinks.removeAt(index);
  }

  addLanguage(): void {
    if (this.newLanguage && this.newProficiency) {
      this.languages.push(this.fb.group({
        language: [this.newLanguage],
        proficiency: [this.newProficiency]
      }));
      this.newLanguage = '';
      this.newProficiency = '';
    }
  }

  removeLanguage(index: number): void {
    this.languages.removeAt(index);
  }

  updateSkills(event: any): void {
    const value = typeof event === 'string' ? event : event.target.value;
    const skillsArray = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    this.profileForm.get('professionalDetails.skills')?.setValue(skillsArray);
  }

  updateTechnologies(event: any): void {
    const value = typeof event === 'string' ? event : event.target.value;
    const techArray = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    this.profileForm.get('professionalDetails.technologies')?.setValue(techArray);
  }

  submitProfile() {
    this.isLoading = true;
    this.errorMessage = '';

    const payload = this.profileForm.value;

    this.profileService.completeProfile(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.currentStep = 5; // Success screen
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to submit profile. Please try again.';
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
