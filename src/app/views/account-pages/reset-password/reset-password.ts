import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  constructor(private router: Router) {}

  resetPassword(): void {
    this.router.navigate(['/login']);
  }
}
