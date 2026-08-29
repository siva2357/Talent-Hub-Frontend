import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastConfig>();

  get toasts$(): Observable<ToastConfig> {
    return this.toastSubject.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000): void {
    this.toastSubject.next({ message, type, duration });
  }
}
