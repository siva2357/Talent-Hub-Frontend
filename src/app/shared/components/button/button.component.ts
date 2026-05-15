import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() variant: 'white' | 'dark' | 'outline' | 'brand' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' = 'white';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;
  @Input() fontSize: string = '14px';

  get buttonClasses(): string {
    const variantClass = `btn-${this.variant}`;
    const sizeClass = `btn-${this.size}`;
    return `${variantClass} ${sizeClass} ${this.customClass}`;
  }
}
