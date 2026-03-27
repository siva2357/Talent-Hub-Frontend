import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RecruiterProfileService } from '../../../core/services/recruiter-profile-service';
import { SeekerProfileService } from '../../../core/services/seeker-profile-service';
import { FilePreview } from '../../shared/file-preview/file-preview';
import { FileUpload } from '../../shared/file-upload/file-upload';
import { BucketKey } from '../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../core/enums/upload-section.constant';
import { InputFields } from '../../components/input-fields/input-fields';
import { Buttons } from "../../components/buttons/buttons";
import { AuthService } from '../../../core/services/auth-service';
import { SOCIAL_ICONS, SocialPlatform } from '../../../core/enums/socialMedia.enum';
import { SOCIAL_URL_PATTERNS } from '../../../core/helpers/social-media.helper';

@Component({
  selector: 'app-profile-form',
  imports: [RouterModule, ReactiveFormsModule, FormsModule, FilePreview, FileUpload, InputFields, Buttons],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm implements OnInit {
  role!: string;
  step = 1;
  get totalSteps() {
    return this.role === 'recruiter' ? 6 : 8;
  }
  get stepsArray() {
    return Array.from({ length: this.totalSteps });
  }
  bucket = BucketKey;
  uploadSection = UploadSection;
  previewImage: any;

  activeForm!: FormGroup;
recruiterForm!: FormGroup;
jobSeekerForm!: FormGroup;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private recruiterService: RecruiterProfileService,
    private seekerService: SeekerProfileService,
    private authService:AuthService
  ) {}

ngOnInit() {
  const role = this.route.snapshot.queryParams['role'];

  if (role !== 'jobSeeker' && role !== 'recruiter') {
    this.router.navigate(['/login']);
    return;
  }

  this.role = role;

  // ✅ create both forms
  this.recruiterForm = this.createRecruiterForm();
  this.jobSeekerForm = this.createJobSeekerForm();

  // ✅ pick active form
  this.activeForm = this.role === 'recruiter'
    ? this.recruiterForm
    : this.jobSeekerForm;

  // ✅ patch user data
  const user = this.authService.getUserData();
  if (user) {
    const names = user.fullName?.split(' ') || [];

    this.activeForm.patchValue({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: user.email || ''
    });

    this.activeForm.get('firstName')?.disable();
    this.activeForm.get('lastName')?.disable();
    this.activeForm.get('email')?.disable();
  }


  this.addSkill();
this.addLanguage();
this.addExperience();
this.addSocialProfile();
this.addCertification()

}


createRecruiterForm() {
  return this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    gender: ['', Validators.required],
    profilePhoto: [''],

    companyName: ['', Validators.required],
    sector: [''],
    designation: ['', Validators.required],
    yearsOfExperience: ['', Validators.required],

    skills: this.fb.array([]),
    languages: this.fb.array([]),
    socialProfiles: this.fb.array([]),

    bioDescription: ['', Validators.required],
  });
}

createJobSeekerForm() {
  return this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    gender: ['', Validators.required],
    profilePhoto: [''],

    skills: this.fb.array([]),
    languages: this.fb.array([]),
    socialProfiles: this.fb.array([]),

currentExperience: this.fb.group({
  jobTitle: ['', Validators.required],
  company: ['', Validators.required],
  duration: ['', Validators.required],
  description: ['', Validators.required],
}),

    experiences: this.fb.array([]),
    certifications: this.fb.array([]),

    bioDescription: ['', Validators.required],
  });
}

get currentExperienceGroup() {
  return this.activeForm.get('currentExperience') as FormGroup;
}



nextStep() {
  if (!this.isCurrentStepValid()) return;
  if (this.step < this.totalSteps) this.step++;
}

isCurrentStepValid(): boolean {
  switch (this.step) {

    case 1:
      return !!this.activeForm.get('mobile')?.valid &&
             !!this.activeForm.get('gender')?.valid;

    case 2:
      return !!this.activeForm.get('profilePhoto')?.value;

    case 3:
      return this.skills.length > 0 && this.languages.length > 0;

    case 5:
      if (this.role === 'recruiter') {
           return !!this.activeForm.get('companyName')?.valid &&
           !!this.activeForm.get('designation')?.valid;
        }

       if (this.role === 'jobSeeker') {
          const ce = this.activeForm.get('currentExperience');
          return !!ce?.valid;
        }

  return true;

    case 6:
      if (this.role === 'jobSeeker') {
        // ✅ validate experiences
        return this.experiences?.length > 0 &&
               this.experiences.controls.every((exp: any) => exp.valid);
      }

      if (this.role === 'recruiter') {
        // ✅ recruiter bio
        return !!this.activeForm.get('bioDescription')?.value;
      }

      return true;

    case 8:
      // ✅ jobSeeker final bio step
      return !!this.activeForm.get('bioDescription')?.value;

    default:
      return true;
  }
}


  get bioStep() {
    return this.role === 'recruiter' ? 6 : 8;
  }


get skills() { return this.activeForm.get('skills') as any|| null; }
get languages() { return this.activeForm.get('languages') as any|| null; }
get socialProfiles() { return this.activeForm.get('socialProfiles') as any|| null; }
get certifications() { return this.activeForm.get('certifications') as any|| null; }
get experiences() {
  return this.activeForm.get('experiences') as any || null;
}

socialPlatformOptions = Object.values(SocialPlatform);
getSocialIcon(platform: SocialPlatform): string {
  return SOCIAL_ICONS[platform];
}
addSocialProfile() {
  const group = this.fb.group({
    platform: ['', Validators.required],
    link: ['', Validators.required],
  });

group.get('platform')?.valueChanges.subscribe((platform) => {
  const linkControl = group.get('link');

  const selectedPlatform = platform as SocialPlatform; // ✅ FIX

  if (selectedPlatform && SOCIAL_URL_PATTERNS[selectedPlatform]) {
    linkControl?.setValidators([
      Validators.required,
      Validators.pattern(SOCIAL_URL_PATTERNS[selectedPlatform])
    ]);
  } else {
    linkControl?.setValidators([Validators.required]);
  }

  linkControl?.updateValueAndValidity();
});

  this.socialProfiles.push(group);
}

removeSocialProfile(index: number) {
  this.socialProfiles.removeAt(index);
}


addSkill() {
  this.skills.push(
    this.fb.group({
      value: ['', Validators.required]
    })
  );
}

removeSkill(i: number) {
  this.skills.removeAt(i);
}

addLanguage() {
  this.languages.push(
    this.fb.group({
      language: ['', Validators.required],
      proficiency: ['', Validators.required],
    })
  );
}

removeLanguage(i: number) {
  this.languages.removeAt(i);
}

addCertification() {
  if (!this.certifications) return;

  this.certifications.push(
    this.fb.group({
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      issuedDate: ['', Validators.required],
      certificateUrl: [''],
    })
  );
}

removeCertification(i: number) {
  this.certifications.removeAt(i);
}


addExperience() {
  if (!this.experiences) return; // ✅ prevent crash

  this.experiences.push(
    this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      duration: ['', Validators.required],
      description: [''],
    })
  );
}

removeExperience(i: number) {
  this.experiences.removeAt(i);
}


  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  onUploadSuccess(url: string) {
    this.activeForm.patchValue({
      profilePhoto: url,
    });

    this.activeForm.get('profilePhoto')?.markAsTouched();
    this.activeForm.get('profilePhoto')?.updateValueAndValidity();

    console.log('Uploaded URL:', url); // ✅ DEBUG
  }

onSubmit() {
  if (this.activeForm.invalid) {
    this.activeForm.markAllAsTouched();
    return;
  }

  const formValue = this.activeForm.getRawValue();

  if (this.role === 'recruiter') {
    this.createRecruiterProfile(formValue);
  } else {
    this.createJobSeekerProfile(formValue);
  }
}

  createRecruiterProfile(payload: any) {
    this.recruiterService.createProfile(payload).subscribe({
      next: (res) => {
        console.log('Recruiter Profile Created:', res);
        this.router.navigate(['/user/my-jobposts']);
      },
      error: (err) => {
        console.error('Recruiter Error:', err);
      },
    });
  }

  createJobSeekerProfile(payload: any) {
    this.seekerService.createProfile(payload).subscribe({
      next: (res) => {
        console.log('JobSeeker Profile Created:', res);
       this.router.navigate(['/user/jobprofile']);
      },
      error: (err) => {
        console.error('JobSeeker Error:', err);
      },
    });
  }
}
