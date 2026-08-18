import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css'
})
export class ProfileForm implements OnInit {
  role: string = '';
  currentStep: number = 1; // 1: Basic, 2: Professional, 3: Social, 4: Review, 5: Success
  isLoading = false;
  isUploadingPhoto = false;
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage = '';

  profileForm!: FormGroup;

  constructor(
    private tokenService: TokenService,
    private profileService: ProfileService,
    private fileService: FileService,
    private router: Router,
    private fb: FormBuilder
  ) { }

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
        companyType: [''],
        website: [''],
        industry: [''],
        companyDescription: ['']
      });
    } else {
      professionalDetails = this.fb.group({
        professionalHeadline: [''],
        skills: [[]],
        technologies: [[]],
        availability: [''],
        preferredJobType: ['']
      });
    }

    this.profileForm = this.fb.group({
      basicInformation: this.fb.group({
        profilePhoto: [''],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        gender: [''],
        shortBio: ['']
      }),
      professionalDetails: professionalDetails,
      location: this.fb.group({
        country: [''],
        state: [''],
        city: [''],
        timezone: ['']
      }),
      socialLinks: this.fb.array([]),
      languages: this.fb.array([])
    });
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

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onload = e => {
        if (reader.result) {
          this.previewUrl = reader.result;
        }
      };
      reader.readAsDataURL(file);

      this.isUploadingPhoto = true;
      this.errorMessage = '';

      const bucket = this.role === 'client' ? UploadBucket.ClientData : UploadBucket.FreelancerData;

      this.fileService.uploadFile(file, bucket, UploadSection.ProfilePhoto, '', true).subscribe({
        next: (res) => {
          this.isUploadingPhoto = false;
          if (res.success) {
            this.profileForm.get('basicInformation.profilePhoto')?.setValue(res.url);
          }
        },
        error: (err) => {
          this.isUploadingPhoto = false;
          this.errorMessage = err.error?.message || 'Failed to upload photo';
        }
      });
    }
  }

  addSocial(platformInput: HTMLSelectElement, urlInput: HTMLInputElement): void {
    if (platformInput.value && urlInput.value) {
      this.socialLinks.push(this.fb.group({
        platform: [platformInput.value],
        profileUrl: [urlInput.value]
      }));
      platformInput.value = '';
      urlInput.value = '';
    }
  }

  removeSocial(index: number): void {
    this.socialLinks.removeAt(index);
  }

  addLanguage(langInput: HTMLSelectElement, profInput: HTMLSelectElement): void {
    if (langInput.value && profInput.value) {
      this.languages.push(this.fb.group({
        language: [langInput.value],
        proficiency: [profInput.value]
      }));
      langInput.value = '';
      profInput.value = '';
    }
  }

  removeLanguage(index: number): void {
    this.languages.removeAt(index);
  }

  updateSkills(event: any): void {
    const value = event.target.value;
    const skillsArray = value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    this.profileForm.get('professionalDetails.skills')?.setValue(skillsArray);
  }

  updateTechnologies(event: any): void {
    const value = event.target.value;
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
