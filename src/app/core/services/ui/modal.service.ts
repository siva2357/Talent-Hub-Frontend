import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ModalConfig {
  id: string;
  title?: string;
  content?: string;
  data?: any;
  showCloseBtn?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSubject = new Subject<ModalConfig>();
  private closeModalSubject = new Subject<string>();

  get openModal$(): Observable<ModalConfig> {
    return this.openModalSubject.asObservable();
  }

  get closeModal$(): Observable<string> {
    return this.closeModalSubject.asObservable();
  }

  open(config: ModalConfig): void {
    this.openModalSubject.next(config);
  }

  close(id: string): void {
    this.closeModalSubject.next(id);
  }
}
