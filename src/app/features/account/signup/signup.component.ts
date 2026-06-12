import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { inject } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})

export class SignupComponent {
  private router = inject(Router);
  selectedRole!: string

  selectRole(role: 'freelancer' | 'client'): void {
    this.selectedRole = role;
  }

  onStartRegistration(): void {
    if (this.selectedRole) {
      this.router.navigate(['/account/registration'], {
        queryParams: { role: this.selectedRole }
      });
    }
  }
}
