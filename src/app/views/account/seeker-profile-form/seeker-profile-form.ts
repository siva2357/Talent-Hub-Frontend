import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators,} from '@angular/forms';
import { BucketKey } from '../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../core/enums/upload-section.constant';
import { SeekerProfileService } from '../../../core/services/seeker-profile-service';
import { Router } from '@angular/router';
import { socialProfileValidator } from '../../../core/helpers/social-media.helper';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../../shared/file-upload/file-upload';
import { FilePreview } from '../../shared/file-preview/file-preview';
import { Language, LanguageEntry, Proficiency } from '../../../core/enums/language.enum';
import { SocialPlatform } from '../../../core/enums/socialMedia.enum';

function minArrayLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) return null;
    return control.length >= min ? null : { minArrayLength: true };
  };
}

@Component({
  selector: 'app-seeker-profile-form',
  imports: [CommonModule,ReactiveFormsModule,FormsModule, FileUpload,FilePreview ],
  templateUrl: './seeker-profile-form.html',
  styleUrl: './seeker-profile-form.css',
})
export class SeekerProfileForm implements OnInit {
  userId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  role!:string;
  profileForm!: FormGroup;
  BucketKey = BucketKey;
  UploadSection = UploadSection;
  profilePhotoUrl!: string;
// profile.component.ts
languages = Object.values(Language);
proficiencyLevels = Object.values(Proficiency);
socialPlatforms = Object.values(SocialPlatform);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private jobSeekerProfileService: SeekerProfileService
  ) {}

  ngOnInit(): void {
   const stored = localStorage.getItem('userData');
    if (!stored) {
      this.router.navigate(['/sign-up/seeker']);
      return;
    }

    const data = JSON.parse(stored);
    this.userId = data.userId;
    this.email = data.email;
    this.role=data.role;

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

  bioDescription: ['', [Validators.required, Validators.minLength(10)]],
currentExperience: this.fb.group({
  jobTitle: ['', Validators.required],
  company: ['', Validators.required],
  duration: ['', Validators.required],
  description: [
    '',
    [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(500)
    ]
  ],
}),

  experiences: this.fb.array([]),
  certifications: this.fb.array([], minArrayLength(1)),

  languages: this.fb.array([], minArrayLength(1)),
  skills: this.fb.array([], minArrayLength(1)),
  socialProfiles: this.fb.array([], minArrayLength(1)),
});

    this.addSocialProfile();
    this.addCertification();
    this.addExperience();
  }

  /* ================= GETTERS ================= */

  get f() {
    return this.profileForm.controls;
  }


  get experiencesArray(): FormArray {
  return this.profileForm.get('experiences') as FormArray;
}

get currentExperienceGroup(): FormGroup {
  return this.profileForm.get('currentExperience') as FormGroup;
}


addExperience(): void {
   this.experiencesArray.markAsTouched();
  this.experiencesArray.push(
    this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      duration: ['', Validators.required],
      description: [''],
    })
  );
}

removeExperience(index: number): void {
  this.experiencesArray.removeAt(index);
  this.experiencesArray.markAsTouched();
}




get certificationsArray(): FormArray {
  return this.profileForm.get('certifications') as FormArray;
}

addCertification(): void {
    this.certificationsArray.markAsTouched();
  this.certificationsArray.push(
    this.fb.group({
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      issuedDate: ['', Validators.required],
      certificateUrl: [''],
    })
  );
}

removeCertification(index: number): void {
  this.certificationsArray.removeAt(index);
  this.certificationsArray.markAsTouched();
}


  get skillsArray(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

addSkill(event: Event): void {
  event.preventDefault(); // 👈 important

  const input = event.target as HTMLInputElement;
  const value = input.value.trim();

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

addLanguage(
  languageSelect: HTMLSelectElement,
  levelSelect: HTMLSelectElement
): void {
  const language = languageSelect.value as Language;
  const proficiency = levelSelect.value as Proficiency;

  this.languagesArray.markAsTouched();

  if (!language || !proficiency) return;

  const exists = this.languagesArray.value.some(
    (l: LanguageEntry) => l.language === language
  );

  if (exists) {
    languageSelect.value = '';
    levelSelect.value = '';
    return;
  }

  this.languagesArray.push(
    this.fb.group({
      language: [language, Validators.required],
      proficiency: [proficiency, Validators.required],
    })
  );

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
  if (!this.canAddAnotherProfile()) {
    this.socialProfiles.at(this.socialProfiles.length - 1)?.markAllAsTouched();
    return;
  }

this.socialProfiles.push(
  this.fb.group(
    {
      platform: ['', Validators.required],
      link: ['', Validators.required],
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

  onPhotoUploaded(url: string): void {
    this.profilePhotoUrl = url + '?v=' + Date.now();

    // 👇 bind upload result to form
    this.profileForm.get('profilePhoto')?.setValue(url);
    this.profileForm.get('profilePhoto')?.markAsTouched();
  }

  submitProfile(): void {
    this.profileForm.get('profilePhoto')?.markAsTouched();

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
       this.experiencesArray.markAsTouched();
  this.certificationsArray.markAsTouched();
  this.languagesArray.markAsTouched();
  this.skillsArray.markAsTouched();
  this.socialProfiles.markAsTouched();

      return;
    }

    const payload = {
      userId: this.userId,
      profilePhoto: this.profilePhotoUrl,
      ...this.profileForm.getRawValue(),
    };

    this.jobSeekerProfileService.createProfile(payload).subscribe(()=>{
        this.router.navigate(['/jobSeeker']);
    });
  }
}
