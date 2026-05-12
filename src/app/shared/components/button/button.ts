import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class ButtonComponent {
  @Input() variant: 'white' | 'dark' | 'outline' | 'brand' = 'white';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customClass: string = '';
  @Input() disabled: boolean = false;

  get buttonClasses(): string {
    const variantClass = `btn-pill-${this.variant}`;
    const sizeClass = this.size === 'sm' ? 'px-3 py-2 text-sm' : this.size === 'lg' ? 'px-5 py-3' : 'px-4 py-2';
    return `${variantClass} ${sizeClass} ${this.customClass} fw-medium`;
  }
}
