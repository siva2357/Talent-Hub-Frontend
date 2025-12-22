import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './confirmation-page.html',
  styleUrl: './confirmation-page.css'
})
export class ConfirmationPage {

  // Role text: "recruiter" or "job seeker"
  role: string = 'recruiter';

  constructor(private router: Router) {
    const savedRole = sessionStorage.getItem('registeredRole');
    this.role = savedRole === 'recruiter' ? 'recruiter' : 'job seeker';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
