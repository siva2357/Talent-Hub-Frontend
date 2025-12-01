import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singup-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './singup-page.html',
  styleUrls: ['./singup-page.css']
})
export class SingupPage {

  selectedRole: 'recruiter' | 'seeker' | null = null;

  constructor(private router: Router) {}

  selectRole(role: 'recruiter' | 'seeker') {
    this.selectedRole = role;
  }

  continue() {
    if (!this.selectedRole) return;

    if (this.selectedRole === 'recruiter') {
      this.router.navigate(['/sign-up/recruiter']);
    } else {
      this.router.navigate(['/sign-up/seeker']);
    }
  }
}
