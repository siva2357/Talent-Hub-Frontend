import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css',
})
export class AccessDeniedComponent {}
