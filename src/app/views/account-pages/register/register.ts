import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private router: Router) {}

  createAccount(): void {
    this.router.navigate(['/otp-verification']);
  }
}
