import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
      // You can also pass the selected role as a query parameter or via state if needed
      this.router.navigate(['/register']);
    }
  }
}
