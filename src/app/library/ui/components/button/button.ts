import { Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {

  @Input() label: string = '';

  @Input() variant: ButtonVariant = 'primary';

  @Input() size: ButtonSize = 'md';

  @Input() disabled: boolean = false;

  @Input() loading: boolean = false;

  @Input() iconOnly: boolean = false;

  @Input() block: boolean = false;

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }

    this.clicked.emit(event);
  }
}