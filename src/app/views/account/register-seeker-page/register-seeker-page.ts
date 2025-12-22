import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { environment } from '../../../../environments/environment';
declare const google: any;

@Component({
  selector: 'app-register-seeker-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-seeker-page.html',
  styleUrl: './register-seeker-page.css'
})
export class RegisterSeekerPage implements OnInit {

  form: FormGroup;
  selectedRole: 'recruiter' | 'seeker' | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
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


  async ngOnInit() {

        await this.loadGoogleScript();
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleResponse(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large', width: 320 }
    );
  }

  handleGoogleResponse(response: any) {
    const idToken = response.credential;

    this.auth.googleSignup(idToken, this.selectedRole!).subscribe({
      next: (res: any) => {
      this.auth.saveAuthData(res.token, res.user);

        if (res.newUser) {
          this.router.navigate(['/sign-up/seeker-profile-form']);
          return;
        }

        this.router.navigate(['/seeker']);
      }
    });
  }

  signup() {
    if (this.form.invalid) return;
    console.log('Manual signup:', this.form.value);
  }
}
