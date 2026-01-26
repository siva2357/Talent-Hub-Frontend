import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { DESIGNATION } from '../../../../../core/enums/designation.enum';
import { RecruiterProfileService } from '../../../../../core/services/recruiter-profile-service';
import { SocialPlatform } from '../../../../../core/enums/socialMedia.enum';
import { Language, Proficiency } from '../../../../../core/enums/language.enum';
import { SECTOR } from '../../../../../core/enums/sector.enum';
import { SECTOR_DESIGNATION_MAP } from '../../../../../core/enums/sector-designation.map';

@Component({
  selector: 'app-update-professional-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-professional-details.html',
  styleUrl: './update-professional-details.css'
})
export class UpdateProfessionalDetails implements OnInit {

  professionalForm!: FormGroup;
selectedCompany!: any;

  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  successMessage = '';

  originalProfile!: any;
companies: any[] = [];
  designations = Object.values(DESIGNATION);
sectors = Object.values(SECTOR);
languagesList = Object.values(Language);
proficiencyList = Object.values(Proficiency);
platforms = Object.values(SocialPlatform);


  constructor(
    private fb: FormBuilder,
    private profileService: RecruiterProfileService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfessionalDetails();
  }

  /* ================= FORM ================= */
  initForm(): void {
    this.professionalForm = this.fb.group({
      companyName: ['', Validators.required], // ✅ correct
      sector: ['', Validators.required],
      designation: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      languages: this.fb.array([this.createLanguage()]),
      socialProfiles: this.fb.array([this.createSocialProfile()])
    });
  }

  /* ================= LOAD ================= */
  loadProfessionalDetails(): void {
    this.isLoading = true;

    this.profileService.getRecruiterProfessional().subscribe({
      next: (res) => {
        if (res.success) {
          const data = res.data;
          this.originalProfile = structuredClone(data);

          this.professionalForm.patchValue({
            companyName: data.companyName,
            designation: data.designation,
             sector: data.sector,
            yearsOfExperience: data.yearsOfExperience
          });

          /* ===== LANGUAGES ===== */
          const langArray = this.fb.array<FormGroup>([]);
          (data.languages || []).forEach(l => {
            langArray.push(this.fb.group({
              language: [l.language, Validators.required],
              level: [l.proficiency, Validators.required]
            }));
          });
          this.professionalForm.setControl(
            'languages',
            langArray.length ? langArray : this.fb.array([this.createLanguage()])
          );

          /* ===== SOCIAL PROFILES ===== */
          const socialArray = this.fb.array<FormGroup>([]);
          (data.socialProfiles || []).forEach(sp => {
            socialArray.push(this.fb.group({
              platform: [sp.platform, Validators.required],
              link: [sp.link, Validators.required]
            }));
          });
          this.professionalForm.setControl(
            'socialProfiles',
            socialArray.length ? socialArray : this.fb.array([this.createSocialProfile()])
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
      level: ['', Validators.required]
    });
  }

  addLanguage(): void {
    this.languages.push(this.createLanguage());
  }

  removeLanguage(index: number): void {
    if (this.languages.length > 1) {
      this.languages.removeAt(index);
    }
  }

  /* ================= SOCIAL PROFILES ================= */
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

  removeSocialProfile(index: number): void {
    if (this.socialProfiles.length > 1) {
      this.socialProfiles.removeAt(index);
    }
  }



onCompanySelect(event: Event): void {
  const companyName = (event.target as HTMLSelectElement).value;

  const company = this.companies.find(
    c => c.companyDetails.companyName === companyName
  );

  if (!company) return;

  this.selectedCompany = company;

  // auto-fill (UI only)
  this.professionalForm.patchValue({
    companyLocation: company.companyDetails.companyAddress,
    companyDescription: company.companyDetails.companyDescription
  });
}


  /* ================= UPDATE ================= */
  updateProfessionalDetails(): void {
    if (this.professionalForm.invalid) {
      this.professionalForm.markAllAsTouched();
      return;
    }

    const payload = this.professionalForm.value;

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.profileService.updateRecruiterProfessional(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Professional details updated successfully';
          this.loadProfessionalDetails();
          this.professionalForm.markAsPristine();
        }
        this.isUpdating = false;
      },
      error: () => {
        this.errorMessage = 'Update failed';
        this.isUpdating = false;
      }
    });
  }

  onSectorChange(): void {
  const sector = this.professionalForm.get('sector')?.value as SECTOR;

  this.designations = sector
    ? SECTOR_DESIGNATION_MAP[sector] || []
    : [];

  this.professionalForm.get('designation')?.reset();
}


  /* ================= DISCARD ================= */
  discard(): void {
    if (!this.originalProfile) return;
    this.loadProfessionalDetails();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
