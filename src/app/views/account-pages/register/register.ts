import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/dtos/auth.dto';
import { UserRole } from '../../../core/enums/role.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerData: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    role: undefined as any // Will be set from query params
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Attempt to get role from query params
    this.route.queryParams.subscribe(params => {
      const roleParam = params['role']?.toLowerCase();
      if (roleParam === 'client') {
        this.registerData.role = UserRole.Client;
      } else if (roleParam === 'freelancer') {
        this.registerData.role = UserRole.Freelancer;
      } else {
        // Redirect to signup if no valid role
        this.router.navigate(['/signup']);
      }
    });
  }

  createAccount(): void {
    if (!this.registerData.role) {
      this.errorMessage = 'Role is missing. Please restart signup.';
      return;
    }

    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Pass email to otp-verification page
          this.router.navigate(['/otp-verification'], { queryParams: { email: this.registerData.email } });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
