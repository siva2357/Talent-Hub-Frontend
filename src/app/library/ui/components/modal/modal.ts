import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ModalVariant =
  | 'default'
  | 'icon';

export type ModalSize =
  | 'sm'
  | 'md'
  | 'lg';

export type ModalIconVariant =
  | 'warning'
  | 'success'
  | 'primary'
  | 'danger'
  | 'purple';

export type ModalButtonVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'secondary';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {

  @Input() open = false;

  @Input() variant: ModalVariant = 'default';

  @Input() size: ModalSize = 'md';

  @Input() title = 'Confirm Action';

  @Input() message = 'Are you sure you want to continue?';

  @Input() icon = 'bi bi-exclamation-triangle';

  @Input() iconVariant: ModalIconVariant = 'warning';

  @Input() showClose = true;

  @Input() showActions = true;

  @Input() showCancel = true;

  @Input() cancelLabel = 'Cancel';

  @Input() confirmLabel = 'Confirm';

  @Input() confirmVariant: ModalButtonVariant = 'primary';

  @Output() closed = new EventEmitter<void>();

  @Output() confirmed = new EventEmitter<void>();

  @Output() cancelled = new EventEmitter<void>();


  onClose(): void {
    this.closed.emit();
  }


  onCancel(): void {
    this.cancelled.emit();
    this.closed.emit();
  }


  onConfirm(): void {
    this.confirmed.emit();
  }

}