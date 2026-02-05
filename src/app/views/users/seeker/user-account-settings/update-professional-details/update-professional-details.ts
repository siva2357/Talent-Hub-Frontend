import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SocialPlatform } from '../../../../../core/enums/socialMedia.enum';
import { Language, Proficiency } from '../../../../../core/enums/language.enum';
import { SeekerProfileService } from '../../../../../core/services/seeker-profile-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-professional-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './update-professional-details.html',
  styleUrl: './update-professional-details.css'
})
export class UpdateProfessionalDetails implements OnInit {

  professionalForm!: FormGroup;

  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  successMessage = '';
skillInputControl = new FormControl('', { nonNullable: true });


  languagesList = Object.values(Language);
  proficiencyList = Object.values(Proficiency);
  platforms = Object.values(SocialPlatform);

  constructor(
    private fb: FormBuilder,
    private profileService: SeekerProfileService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfessionalDetails();
  }

  /* ================= FORM ================= */
  initForm(): void {
    this.professionalForm = this.fb.group({
      languages: this.fb.array([this.createLanguage()]),
      socialProfiles: this.fb.array([this.createSocialProfile()]),
      experiences: this.fb.array([this.createExperience()]),
      certifications: this.fb.array([this.createCertification()]),
      skills: this.fb.array([this.createSkill()])
    });
  }

  /* ================= LOAD ================= */
  loadProfessionalDetails(): void {
    this.isLoading = true;

    this.profileService.getJobSeekerProfessional().subscribe({
      next: (res) => {
        if (res.success) {
          const data = res.data;

          /* ===== LANGUAGES ===== */
          const langArray = this.fb.array<FormGroup>([]);
          (data.languages || []).forEach((l: any) => {
            langArray.push(this.fb.group({
              language: [l.language, Validators.required],
              proficiency: [l.proficiency, Validators.required]
            }));
          });
          this.professionalForm.setControl(
            'languages',
            langArray.length ? langArray : this.fb.array([this.createLanguage()])
          );

          /* ===== SOCIAL PROFILES ===== */
          const socialArray = this.fb.array<FormGroup>([]);
          (data.socialProfiles || []).forEach((sp: any) => {
            socialArray.push(this.fb.group({
              platform: [sp.platform, Validators.required],
              link: [sp.link, Validators.required]
            }));
          });
          this.professionalForm.setControl(
            'socialProfiles',
            socialArray.length ? socialArray : this.fb.array([this.createSocialProfile()])
          );

          /* ===== EXPERIENCES ===== */
          const expArray = this.fb.array<FormGroup>([]);
          (data.experiences || []).forEach((e: any) => {
            expArray.push(this.fb.group({
              jobTitle: [e.jobTitle, Validators.required],
              company: [e.company, Validators.required],
              duration: [e.duration, Validators.required],
              description: [e.description]
            }));
          });
          this.professionalForm.setControl(
            'experiences',
            expArray.length ? expArray : this.fb.array([this.createExperience()])
          );

          /* ===== CERTIFICATIONS ===== */
          const certArray = this.fb.array<FormGroup>([]);
          (data.certifications || []).forEach((c: any) => {
            certArray.push(this.fb.group({
              name: [c.name, Validators.required],
              issuedBy: [c.issuedBy, Validators.required],
              issuedDate: [c.issuedDate?.substring(0, 10), Validators.required],
              certificateUrl: [c.certificateUrl]
            }));
          });
          this.professionalForm.setControl(
            'certifications',
            certArray.length ? certArray : this.fb.array([this.createCertification()])
          );

          /* ===== SKILLS ===== */
          const skillsArray = this.fb.array<FormGroup>([]);
          (data.skills || []).forEach((s: string) => {
            skillsArray.push(this.fb.group({
              name: [s, Validators.required]
            }));
          });
          this.professionalForm.setControl(
            'skills',
            skillsArray.length ? skillsArray : this.fb.array([this.createSkill()])
          );
        }

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load professional details';
        this.isLoading = false;
      }
    });
  }

  /* ================= LANGUAGES ================= */
  get languages(): FormArray {
    return this.professionalForm.get('languages') as FormArray;
  }

  createLanguage(): FormGroup {
    return this.fb.group({
      language: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addLanguage(): void {
    this.languages.push(this.createLanguage());
  }

  removeLanguage(i: number): void {
    if (this.languages.length > 1) this.languages.removeAt(i);
  }

  /* ================= SOCIAL ================= */
  get socialProfiles(): FormArray {
    return this.professionalForm.get('socialProfiles') as FormArray;
  }

  createSocialProfile(): FormGroup {
    return this.fb.group({
      platform: ['', Validators.required],
      link: ['', Validators.required]
    });
  }

  addSocialProfile(): void {
    this.socialProfiles.push(this.createSocialProfile());
  }

  removeSocialProfile(i: number): void {
    if (this.socialProfiles.length > 1) this.socialProfiles.removeAt(i);
  }

  /* ================= EXPERIENCE ================= */
  get experiences(): FormArray {
    return this.professionalForm.get('experiences') as FormArray;
  }

  createExperience(): FormGroup {
    return this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['']
    });
  }

  addExperience(): void {
    this.experiences.push(this.createExperience());
  }

  removeExperience(i: number): void {
    if (this.experiences.length > 1) this.experiences.removeAt(i);
  }

  /* ================= CERTIFICATION ================= */
  get certifications(): FormArray {
    return this.professionalForm.get('certifications') as FormArray;
  }

  createCertification(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      issuedBy: ['', Validators.required],
      issuedDate: ['', Validators.required],
      certificateUrl: ['']
    });
  }

  addCertification(): void {
    this.certifications.push(this.createCertification());
  }

  removeCertification(i: number): void {
    if (this.certifications.length > 1) this.certifications.removeAt(i);
  }

  /* ================= SKILLS ================= */
  get skills(): FormArray {
    return this.professionalForm.get('skills') as FormArray;
  }

  updateSkill(index: number, event: Event) {
  const value = (event.target as HTMLElement).innerText.trim();
  this.skills.at(index).get('name')?.setValue(value);
}


  createSkill(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

skillInput = '';


addSkill(): void {
  const value = this.skillInputControl.value.trim();
  if (!value) return;

  this.skills.push(
    this.fb.group({
      name: [value, Validators.required]
    })
  );

  this.skillInputControl.reset('');
}


  removeSkill(i: number): void {
    if (this.skills.length > 1) this.skills.removeAt(i);
  }

  /* ================= UPDATE ================= */
  updateProfessionalDetails(): void {
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      return;
    }

    const raw = this.professionalForm.value;

    // convert skills [{name}] → string[]
    raw.skills = raw.skills.map((s: any) => s.name);

    this.isUpdating = true;

    this.profileService.updateJobSeekerProfessional(raw).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Professional details updated successfully';
          this.loadProfessionalDetails();
        }
        this.isUpdating = false;
      },
      error: () => {
        this.errorMessage = 'Update failed';
        this.isUpdating = false;
      }
    });
  }
}
