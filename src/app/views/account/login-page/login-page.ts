import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth-service';

declare const google: any;

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
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
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
      callback: (response: any) => this.handleGoogleLogin(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleLoginBtn'),
      { theme: 'outline', size: 'large', width: 320 }
    );
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;

    this.auth.googleLogin(idToken).subscribe({
      next: (res: any) => {
        if (res.newUser) {
          this.router.navigate(['/sign-up'], {
            queryParams: {
              google: true,
              email: res.email,
              idToken,
              name: res.name
            }
          });
          return;
        }

        this.auth.saveToken(res.token);
        this.router.navigate(['/' + res.user.role]);
      }
    });
  }

  login() {
    if (this.form.invalid) return;
  }
}
