import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AiChatbot } from './library/shared/components/ai-chatbot/ai-chatbot';
import { ToastService } from './core/services/ui/toast.service';
import { ToastConfig } from './core/models/ui.model';
import { Toast } from './library/ui/components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AiChatbot, CommonModule, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  toasts: (ToastConfig & { id: number })[] = [];
  private toastId = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(toast => {
      const id = this.toastId++;
      this.toasts.push({ ...toast, id });
      setTimeout(() => this.removeToast(id), toast.duration || 3000);
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getVariant(type?: string): any {
    if (type === 'error') return 'danger';
    if (type === 'success') return 'success';
    if (type === 'warning') return 'warning';
    return 'info';
  }

  getIcon(type?: string): string {
    if (type === 'error') return 'bi bi-exclamation-octagon-fill';
    if (type === 'success') return 'bi bi-check-circle-fill';
    if (type === 'warning') return 'bi bi-exclamation-triangle-fill';
    return 'bi bi-info-circle-fill';
  }

  getTitle(type?: string): string {
    if (type === 'error') return 'Error';
    if (type === 'success') return 'Success';
    if (type === 'warning') return 'Warning';
    return 'Notification';
  }
}