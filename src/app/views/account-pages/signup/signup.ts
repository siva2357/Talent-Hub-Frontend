import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, Button],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private readonly router = inject(Router);

  selectedRole: 'client' | 'freelancer' | null = null;

  selectRole(role: 'client' | 'freelancer'): void {
    this.selectedRole = role;
  }

  continue(): void {
    if (!this.selectedRole) {
      return;
    }

    this.router.navigate(['/register'], {
      queryParams: {
        role: this.selectedRole
      }
    });
  }
}

