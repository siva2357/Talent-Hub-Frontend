import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  loginDetails!: FormGroup;

  isLoading: boolean = false;
  loginSuccess: boolean = false;
  showPassword: boolean = false;
  submitted = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginDetails = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    });
  }

  // Get form controls
  get f() { return this.loginDetails.controls; }


onSubmit() {
  this.submitted = true;
  if (this.loginDetails.invalid) {
    Object.keys(this.loginDetails.controls).forEach(controlName => {
      this.loginDetails.get(controlName)?.markAsTouched();
    });
    return;
  }
  this.isLoading = true;
  this.authService.login(this.loginDetails.value).subscribe(
    response => {
      this.loginSuccess = true;
      if (response.token) {
        localStorage.setItem('Authorization', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userData', JSON.stringify(response));
        this.authService.setUserRole(response.role);
      }
      this.isLoading = false;
      switch (response.role) {
        case 'recruiter':
          this.router.navigate(response.profileCompleted ? ['recruiter'] : ['sign-up/recruiter-profile-form']);
          break;
        case 'jobSeeker':
          this.router.navigate(response.profileCompleted ? ['jobSeeker'] : ['sign-up/seeker-profile-form']);
          break;
        case 'admin':
          this.router.navigate(['admin']);
          break;
      }
    },
    (error :any)=> {
      this.isLoading = false;
      this.loginSuccess = false;
    }
  );
}





goToSignupPage(){
    this.router.navigate(['sign-up']);
}

  goToForgotPassword(){
    this.router.navigate(['forgot-password']);
  }

}
