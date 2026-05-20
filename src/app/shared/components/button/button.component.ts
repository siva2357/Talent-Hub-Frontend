import { Component, Input, HostBinding } from '@angular/core';
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
  @Input() loading: boolean = false;
  @Input() fontSize: string = '14px';

  @HostBinding('class.w-100')
  get isFullWidth(): boolean {
    return this.customClass.includes('w-100');
  }

  get buttonClasses(): string {
    const variantClass = `btn-${this.variant}`;
    const sizeClass = `btn-${this.size}`;
    return `btn transition-all d-inline-flex align-items-center justify-content-center gap-2 ${variantClass} ${sizeClass} ${this.customClass}`;
  }
}
