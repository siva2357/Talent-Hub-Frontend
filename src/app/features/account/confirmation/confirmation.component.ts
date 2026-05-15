import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
})
export class ConfirmationComponent {
  role: 'freelancer' | 'client' = 'freelancer';

  toggleRole(): void {
    this.role = this.role === 'freelancer' ? 'client' : 'freelancer';
  }
}
