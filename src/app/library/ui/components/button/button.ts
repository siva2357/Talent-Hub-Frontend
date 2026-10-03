import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

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

  @Input() label = '';

  @Input() variant: ButtonVariant = 'primary';

  @Input() size: ButtonSize = 'md';

  @Input() disabled = false;

  @Input() loading = false;

  @Input() iconOnly = false;

  @Input() block = false;

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() route: string | null = null;

  @Input() target: string | null = null;

  @Output() clicked = new EventEmitter<void>();

  constructor(private router: Router) { }

  async onClick(event: Event): Promise<void> {

    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }

    // Notify parent component
    this.clicked.emit();

    // Optional navigation
    if (this.route) {

      if (this.target === '_blank') {

        window.open(
          this.router.serializeUrl(
            this.router.createUrlTree([this.route])
          ),
          '_blank'
        );

      } else {

        await this.router.navigateByUrl(this.route);

      }
    }
  }
}