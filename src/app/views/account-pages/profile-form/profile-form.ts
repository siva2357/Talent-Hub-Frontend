import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-form',
  imports: [],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css'
})
export class ProfileForm {
  role: string = 'client'; // 'client' or 'freelancer'
  currentStep: number = 1; // 1: Basic, 2: Professional, 3: Social, 4: Review

  nextStep() {
    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  submitProfile() {
    this.currentStep = 5; // Step 5 is the success screen
  }
}
