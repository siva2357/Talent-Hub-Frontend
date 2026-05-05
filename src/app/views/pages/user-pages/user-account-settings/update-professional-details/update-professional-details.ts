import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth-service';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';
import { InputFields } from '../../../../components/input-fields/input-fields';
import { Buttons } from '../../../../components/buttons/buttons';
import { Language, Proficiency } from '../../../../../core/enums/language.enum';
import { SocialPlatform } from '../../../../../core/enums/socialMedia.enum';

@Component({
  selector: 'app-update-professional-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFields, Buttons],
  templateUrl: './update-professional-details.html',
  styleUrl: './update-professional-details.css'
})
export class UpdateProfessionalDetails implements OnInit {
  role: string | null = null;
  form!: FormGroup;
  isLoading = false;
  isSaving = false;

  languageOptions = Object.values(Language);
  proficiencyOptions = Object.values(Proficiency);
  socialPlatformOptions = Object.values(SocialPlatform);

  constructor(
    private authService: AuthService,
    private seekerService: SeekerProfileService,
    private recruiterService: RecruiterProfileService,
    public fb: FormBuilder
  ) {
    this.role = this.authService.getRole();
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProfessionalDetails();
  }

  initForm() {
    if (this.role === 'recruiter') {
      this.form = this.fb.group({
        companyName: ['', Validators.required],
        sector: [''],
        designation: ['', Validators.required],
        yearsOfExperience: ['', Validators.required],
        skills: this.fb.array([]),
        languages: this.fb.array([]),
        socialProfiles: this.fb.array([])
      });
    } else {
      this.form = this.fb.group({
        currentExperience: this.fb.group({
          jobTitle: ['', Validators.required],
          company: ['', Validators.required],
          duration: ['', Validators.required],
          description: ['']
        }),
        experiences: this.fb.array([]),
        certifications: this.fb.array([]),
        skills: this.fb.array([]),
        languages: this.fb.array([]),
        socialProfiles: this.fb.array([])
      });
    }
  }

  get skills() { return this.form.get('skills') as FormArray; }
  get languages() { return this.form.get('languages') as FormArray; }
  get socialProfiles() { return this.form.get('socialProfiles') as FormArray; }
  get experiences() { return this.form.get('experiences') as FormArray; }
  get certifications() { return this.form.get('certifications') as FormArray; }

  loadProfessionalDetails(): void {
    this.isLoading = true;
    const obs = (this.role === 'jobSeeker' 
      ? this.seekerService.getJobSeekerProfessional() 
      : this.recruiterService.getRecruiterProfessional()) as Observable<any>;

    obs.subscribe({
      next: (res: any) => {
        const data = res.data;
        
        // Patch simple values
        this.form.patchValue(data);

        // Clear and patch FormArrays
        this.patchArray(this.skills, data.skills, (val: any) => this.fb.control(val));
        this.patchArray(this.languages, data.languages, (val: any) => this.fb.group({
          language: [val.language, Validators.required],
          proficiency: [val.proficiency, Validators.required]
        }));
        this.patchArray(this.socialProfiles, data.socialProfiles, (val: any) => this.fb.group({
          platform: [val.platform, Validators.required],
          link: [val.link, Validators.required]
        }));

        if (this.role === 'jobSeeker') {
          this.patchArray(this.experiences, data.experiences, (val: any) => this.fb.group({
            jobTitle: [val.jobTitle, Validators.required],
            company: [val.company, Validators.required],
            duration: [val.duration, Validators.required],
            description: [val.description]
          }));
          this.patchArray(this.certifications, data.certifications, (val: any) => this.fb.group({
            name: [val.name, Validators.required],
            issuedBy: [val.issuedBy, Validators.required],
            issuedDate: [val.issuedDate, Validators.required],
            certificateUrl: [val.certificateUrl]
          }));
        }

        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  private patchArray(formArray: FormArray, data: any[], factory: (val: any) => any) {
    formArray.clear();
    if (data && data.length) {
      data.forEach(item => formArray.push(factory(item)));
    }
  }

  // Helper methods to add/remove from arrays
  addSkillItem() {
    this.skills.push(this.fb.control(''));
  }

  addLanguageItem() {
    this.languages.push(this.fb.group({
      language: ['', Validators.required],
      proficiency: ['', Validators.required]
    }));
  }

  removeItem(arrayName: string, index: number) {
    (this.form.get(arrayName) as FormArray).removeAt(index);
  }

  addItem(arrayName: string, factory: () => any) {
    (this.form.get(arrayName) as FormArray).push(factory());
  }

  addExperienceHistory() {
    this.experiences.push(this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['']
    }));
  }

  addSocialProfile() {
    this.socialProfiles.push(this.fb.group({
      platform: ['', Validators.required],
      link: ['', Validators.required]
    }));
  }

  updateProfessional(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSaving = true;
    const payload = this.form.getRawValue();
    
    const obs = (this.role === 'jobSeeker'
      ? this.seekerService.updateJobSeekerProfessional(payload)
      : this.recruiterService.updateRecruiterProfessional(payload)) as Observable<any>;

    obs.subscribe({
      next: () => {
        this.isSaving = false;
      },
      error: () => (this.isSaving = false),
    });
  }
}
