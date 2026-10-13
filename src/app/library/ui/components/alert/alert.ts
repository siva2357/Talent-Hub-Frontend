import { Component, EventEmitter, Input, Output } from '@angular/core';

type AlertVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'secondary';

type AlertMode =
  | 'default'
  | 'single-line';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.html',
  styleUrl: './alert.css'
})
export class Alert {

  @Input() variant: AlertVariant = 'info';

  @Input() title: string = 'sample';

  @Input() message: string = 'sample text';

  @Input() icon: string = 'bi bi-check-circle';

  @Input() mode: AlertMode = 'default';

  @Input() closable: boolean = true;

  @Input() showIcon: boolean = true;

  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }
}