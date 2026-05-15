import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { inject } from '@angular/core';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  private router = inject(Router);

  onRegister(): void {
    this.router.navigate(['/account/otp-verification'], { queryParams: { mode: 'register' } });
  }
}
