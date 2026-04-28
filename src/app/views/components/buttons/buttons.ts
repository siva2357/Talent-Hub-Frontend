import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './buttons.html',
  styleUrl: './buttons.css',
  imports:[CommonModule]
})
export class Buttons {
  @Input() label: string = 'Button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';

  
}
