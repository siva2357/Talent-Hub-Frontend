import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  imports: [RouterModule, ReactiveFormsModule ,FormsModule],
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

  previewImage: any;

  profileForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {

    const role = this.route.snapshot.queryParams['role'];

    if (role !== 'jobSeeker' && role !== 'recruiter') {
      this.router.navigate(['/login']);
      return;
    }

    this.role = role;



    // 🔥 MAIN FORM
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],

      profilePhoto: ['', Validators.required],

      skills: this.fb.array([]),
      languages: this.fb.array([]),
      socialProfiles: this.fb.array([]),

      bioDescription: ['', Validators.required],

      // ✅ JobSeeker only
      currentExperience: this.fb.group({
        jobTitle: [''],
        company: [''],
        duration: [''],
        description: ['']
      }),

      experiences: this.fb.array([]),
      certifications: this.fb.array([]),

      // ✅ Recruiter only
      companyName: [''],
      sector: [''],
      designation: [''],
      yearsOfExperience: ['']
    });
  }

nextStep() {

  this.step++;

  // 🔥 skip jobSeeker-only steps
  if (this.role === 'recruiter') {

    if (this.step === 6) {
      this.step = 6; // this becomes BIO step now
    }

  }

}

get bioStep() {
  return this.role === 'recruiter' ? 6 : 8;
}

  prevStep(){
    if(this.step > 1){
      this.step--;
    }
  }




onFileSelected(event: any) {

  const file = event.target.files[0];

  if (file) {

    // ✅ store in form
    this.profileForm.patchValue({
      profilePhoto: file
    });

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImage = reader.result;
    };

    reader.readAsDataURL(file);
  }
}


onSubmit() {

  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  let data = this.profileForm.value;

  // 🔥 clean based on role
  if (this.role === 'recruiter') {
    delete data.currentExperience;
    delete data.experiences;
    delete data.certifications;
  }

  if (this.role === 'jobSeeker') {
    delete data.companyName;
    delete data.sector;
    delete data.designation;
    delete data.yearsOfExperience;
  }

  console.log('FINAL DATA:', data);
}


}
