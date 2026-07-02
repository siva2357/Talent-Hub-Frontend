import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalService } from '../../../core/services/alert-modal.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css'
})
export class AlertModalComponent {
  modalService = inject(AlertModalService);

  get config() {
    return this.modalService.config;
  }

  onConfirm() {
    if (this.config?.onConfirm) {
      this.config.onConfirm();
    }
    this.modalService.close();
  }

  onCancel() {
    if (this.config?.onCancel) {
      this.config.onCancel();
    }
    this.modalService.close();
  }
}
