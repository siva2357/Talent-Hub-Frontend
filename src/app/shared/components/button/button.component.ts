import { Component, input, HostBinding, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  variant = input<'white' | 'dark' | 'outline' | 'brand' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light'>('white');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit'>('button');
  customClass = input<string>('');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fontSize = input<string>('14px');

  @HostBinding('class.w-100')
  get isFullWidth(): boolean {
    return this.customClass().includes('w-100');
  }

  buttonClasses = computed(() => {
    return `btn transition-all d-inline-flex align-items-center justify-content-center gap-2 btn-${this.variant()} btn-${this.size()} ${this.customClass()}`;
  });
}
