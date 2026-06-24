import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  /**
   * Defines the visual style of the badge.
   * Options: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
   */
  @Input() variant: string = 'primary';
  
  /**
   * Additional custom classes to append to the badge
   */
  @Input() customClass: string = '';
}
