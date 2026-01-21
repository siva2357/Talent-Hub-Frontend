import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singup-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './singup-page.html',
  styleUrls: ['./singup-page.css'],
})
export class SingupPage {

  selectedRole: 'recruiter' | 'jobSeeker' | null = null;

  constructor(private router: Router) {}

  selectRole(role: 'recruiter' | 'jobSeeker') {
    this.selectedRole = role;
  }


 continue() {
    if (!this.selectedRole) return;

    this.router.navigate(
      ['/register'],
      {
        queryParams: { role: this.selectedRole }
      }
    );
  }


}
