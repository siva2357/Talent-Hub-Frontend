import { Injectable, signal } from '@angular/core';

export interface AlertModalConfig {
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {
  private configSignal = signal<AlertModalConfig | null>(null);
  
  get config() {
    return this.configSignal();
  }

  show(config: AlertModalConfig) {
    this.configSignal.set(config);
  }

  close() {
    this.configSignal.set(null);
  }
}
