import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ToastVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'secondary'
  | 'primary';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {

  @Input() variant: ToastVariant = 'success';

  @Input() title = 'Success!';

  @Input() message =
    'Your changes have been saved successfully.';

  @Input() icon = 'bi bi-check-circle-fill';

  @Input() closable = true;

  @Output() closed =
    new EventEmitter<void>();


  onClose(): void {
    this.closed.emit();
  }

}