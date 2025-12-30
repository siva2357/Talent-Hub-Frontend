import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { BucketKey } from '../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../core/enums/upload-section.constant';
import { socialProfileValidator } from '../../../core/helpers/social-media.helper';
import { FileUpload } from '../../shared/file-upload/file-upload';
import { FilePreview } from '../../shared/file-preview/file-preview';
import { RecruiterProfileService } from '../../../core/services/recruiter-profile-service';

function minArrayLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) return null;
    return control.length >= min ? null : { minArrayLength: true };
  };
}
@Component({
  selector: 'app-recruiter-profile-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,CommonModule, FileUpload, FilePreview],
  templateUrl: './recruiter-profile-form.html',
  styleUrl: './recruiter-profile-form.css',
})
export class RecruiterProfileForm implements OnInit {



  userId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;

  profileForm!: FormGroup;

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  profilePhotoUrl!: string;

  // profilePhotoUrl =
  //   'https://res.cloudinary.com/dpp8aspqs/image/upload/v1737957959/profie_images_j53njq.png';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recruiterProfileService: RecruiterProfileService
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('recruiterRegistration');
    if (!stored) {
      this.router.navigate(['/sign-up/recruiter']);
      return;
    }

    const data = JSON.parse(stored);
    this.userId = data.userId;
    this.email = data.email;

  const fullNameParts = (data.fullName || '').trim().split(' ');
  this.firstName = fullNameParts[0] || '';
  this.lastName = fullNameParts.slice(1).join(' ') || '';

this.profileForm = this.fb.group({
  firstName: [{ value: this.firstName, disabled: true }],
  lastName: [{ value: this.lastName, disabled: true }],
  email: [{ value: this.email, disabled: true }],

  profilePhoto: [null, Validators.required],

  mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  gender: ['', Validators.required],

  companyId: ['', Validators.required],
  companyLocation: [{ value: '', disabled: true }],
  companyDescription: [{ value: '', disabled: true }],

  sector: ['', Validators.required],
  designation: ['', Validators.required],
  yearsOfExperience: ['', [Validators.required, Validators.min(0)]],

  jobDescription: ['', [Validators.required, Validators.minLength(10)]],

  languages: this.fb.array([], minArrayLength(1)),
  skills: this.fb.array([], minArrayLength(1)),
  socialProfiles: this.fb.array([], minArrayLength(1))
});

this.addSocialProfile();  }


  /* ================= GETTERS ================= */

  get f() {
    return this.profileForm.controls;
  }

  get skillsArray(): FormArray {
  return this.profileForm.get('skills') as FormArray;
}



addSkill(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value.trim();

  // 👇 user interacted → mark touched
  this.skillsArray.markAsTouched();

  if (!value) return;

  if (this.skillsArray.value.includes(value)) {
    input.value = '';
    return;
  }

  this.skillsArray.push(this.fb.control(value));
  input.value = '';
}


removeSkill(index: number): void {
  this.skillsArray.removeAt(index);
}

get languagesArray(): FormArray {
  return this.profileForm.get('languages') as FormArray;
}

addLanguage(languageSelect: HTMLSelectElement, levelSelect: HTMLSelectElement): void {
  const language = languageSelect.value;
  const level = levelSelect.value;

  // mark touched only on interaction
  this.languagesArray.markAsTouched();

  if (!language || !level) return;

  // prevent duplicates
  const exists = this.languagesArray.value.some(
    (l: any) => l.language === language
  );
  if (exists) {
    languageSelect.value = '';
    levelSelect.value = '';
    return;
  }

  this.languagesArray.push(
    this.fb.group({
      language: [language, Validators.required],
      level: [level, Validators.required]
    })
  );

  // reset selects
  languageSelect.value = '';
  levelSelect.value = '';
}



removeLanguage(index: number): void {
  this.languagesArray.removeAt(index);
  this.languagesArray.markAsTouched();
}

  get socialProfiles(): FormArray {
    return this.profileForm.get('socialProfiles') as FormArray;
  }

  /* ================= SOCIAL PROFILES ================= */
canAddAnotherProfile(): boolean {
  if (this.socialProfiles.length === 0) {
    return true; // first row allowed
  }

  const lastGroup = this.socialProfiles.at(this.socialProfiles.length - 1);
  return lastGroup.valid;
}


addSocialProfile(): void {
  // safety check
  if (!this.canAddAnotherProfile()) {
    this.socialProfiles.at(this.socialProfiles.length - 1).markAsTouched();
    return;
  }

  this.socialProfiles.push(
    this.fb.group(
      {
        platform: ['', Validators.required],
        link: ['', Validators.required]
      },
      { validators: socialProfileValidator() }
    )
  );
}
isProfileInvalid(index: number): boolean {
  const group = this.socialProfiles.at(index);
  return group.invalid && group.touched;
}


removeSocialProfile(index: number): void {
  this.socialProfiles.removeAt(index);

  // ensure at least one row always exists
  if (this.socialProfiles.length === 0) {
    this.addSocialProfile();
  }
}


  /* ================= PHOTO ================= */

onPhotoUploaded(url: string): void {
  this.profilePhotoUrl = url + '?v=' + Date.now();

  // 👇 bind upload result to form
  this.profileForm.get('profilePhoto')?.setValue(url);
  this.profileForm.get('profilePhoto')?.markAsTouched();
}

  /* ================= SUBMIT ================= */

submitProfile(): void {
  this.profileForm.get('profilePhoto')?.markAsTouched();

  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    this.skillsArray.markAsTouched();
    this.languagesArray.markAsTouched();
    this.socialProfiles.markAsTouched();
    return;
  }

  const payload = {
    userId: this.userId,
    profilePhoto: this.profilePhotoUrl,
    ...this.profileForm.getRawValue()
  };

  this.recruiterProfileService.createProfile(payload).subscribe({
    next: () => {
      localStorage.removeItem('recruiterRegistration');
      this.router.navigate(['/account-registered']);
    }
  });
}

}
