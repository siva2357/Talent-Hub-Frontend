import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';


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
  | 'outline-warning';


@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {

  /* =========================================================
     STATE
     ========================================================= */

  @Input() open = false;


  /* =========================================================
     APPEARANCE
     ========================================================= */

  @Input() variant: ModalVariant = 'default';

  @Input() size: ModalSize = 'md';


  /* =========================================================
     CONTENT
     ========================================================= */

  @Input() title = 'Confirm Action';

  @Input() message =
    'Are you sure you want to continue?';


  /* =========================================================
     ICON
     ========================================================= */

  @Input() icon =
    'bi bi-exclamation-triangle';

  @Input() iconVariant: ModalIconVariant =
    'warning';


  /* =========================================================
     ACTION OPTIONS
     ========================================================= */

  @Input() showClose = true;

  @Input() showActions = true;

  @Input() showCancel = true;


  /* =========================================================
     BUTTON LABELS
     ========================================================= */

  @Input() cancelLabel = 'Cancel';

  @Input() confirmLabel = 'Confirm';


  /* =========================================================
     CONFIRM BUTTON
     ========================================================= */

  @Input() confirmVariant: ModalButtonVariant =
    'primary';

  @Input() cancelVariant: ModalButtonVariant =
    'outline-secondary';


  /* =========================================================
     EVENTS
     ========================================================= */

  @Output() closed =
    new EventEmitter<void>();

  @Output() confirmed =
    new EventEmitter<void>();

  @Output() cancelled =
    new EventEmitter<void>();


  /* =========================================================
     CLOSE
     ========================================================= */

  onClose(): void {
    this.closed.emit();
  }


  /* =========================================================
     CANCEL
     ========================================================= */

  onCancel(): void {
    this.cancelled.emit();
    this.closed.emit();
  }


  /* =========================================================
     CONFIRM
     ========================================================= */

  onConfirm(): void {
    this.confirmed.emit();
  }

}