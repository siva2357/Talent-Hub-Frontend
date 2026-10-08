import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ModalButtonVariant, ModalIconVariant, ModalSize, ModalVariant } from '../../../library/ui/components/modal/modal';

export interface ModalOptions {
  id?: string;
  title?: string;
  message?: string;
  variant?: ModalVariant;
  size?: ModalSize;
  icon?: string;
  iconVariant?: ModalIconVariant;
  showClose?: boolean;
  showActions?: boolean;
  showCancel?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmVariant?: ModalButtonVariant;
}

export interface ActiveModal extends ModalOptions {
  open: boolean;
  resolve?: (confirmed: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalStateSubject = new Subject<ActiveModal>();

  get modalState$(): Observable<ActiveModal> {
    return this.modalStateSubject.asObservable();
  }

  confirm(options: ModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.modalStateSubject.next({
        open: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to continue?',
        variant: options.variant || 'icon',
        size: options.size || 'sm',
        icon: options.icon || 'bi bi-exclamation-triangle',
        iconVariant: options.iconVariant || 'warning',
        showClose: options.showClose ?? true,
        showActions: options.showActions ?? true,
        showCancel: options.showCancel ?? true,
        cancelLabel: options.cancelLabel || 'Cancel',
        confirmLabel: options.confirmLabel || 'Confirm',
        confirmVariant: options.confirmVariant || 'primary',
        resolve
      });
    });
  }

  close(): void {
    this.modalStateSubject.next({ open: false });
  }
}
