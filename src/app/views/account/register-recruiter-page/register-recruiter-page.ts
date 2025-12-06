import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { environment } from '../../../../environments/environment';
declare const google: any;

@Component({
  selector: 'app-register-recruiter-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-recruiter-page.html',
  styleUrl: './register-recruiter-page.css',
})
export class RegisterRecruiterPage implements OnInit {

  form: FormGroup;
  selectedRole: 'recruiter' | 'seeker' | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
  ) {

    this.selectedRole = this.route.snapshot.queryParamMap.get('role') as any;

    if (!this.selectedRole) {
      this.router.navigate(['/sign-up']);
    }

    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }



  loadGoogleScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof google !== 'undefined') {
      resolve();
      return;
    }

    const check = setInterval(() => {
      if (typeof google !== 'undefined') {
        clearInterval(check);
        resolve();
      }
    }, 50);
  });
}


  // -----------------------------------------
  // INITIALIZE GOOGLE IDENTITY SERVICES (GIS)
  // -----------------------------------------
  async ngOnInit() {

        await this.loadGoogleScript();

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (resp: any) => this.handleGoogleCredential(resp)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleRecruiterBtn'),
      { theme: 'outline', size: 'large', width: 320 }
    );
  }

  // -----------------------------------------
  // GOOGLE RESPONSE HANDLER
  // -----------------------------------------
  handleGoogleCredential(response: any) {
    const idToken = response.credential;

    this.auth.googleSignup(idToken, 'recruiter').subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);

        if (res.newUser) {
          this.router.navigate(['/sign-up/recruiter-profile-form']);
          return;
        }

        this.router.navigate(['/recruiter']);
      },
      error: (err) => console.error("Google Signup Error:", err)
    });
  }

  signup() {
    if (this.form.invalid) return;
  }
}
