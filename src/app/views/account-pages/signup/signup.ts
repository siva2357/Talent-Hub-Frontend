import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  selectedRole: 'client' | 'freelancer' | null = null;

  constructor(private router: Router) { }

  selectRole(role: 'client' | 'freelancer'): void {
    this.selectedRole = role;
  }

  continue(): void {
    if (this.selectedRole) {
      this.router.navigate(['/register'], { queryParams: { role: this.selectedRole } });
    }
  }
}
