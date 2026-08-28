import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private static readonly DISMISS_AFTER_MS = 4000;

  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private nextId = 1;

  get toasts$(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(toast => toast.id !== id));
  }

  private show(message: string, type: ToastType): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => this.dismiss(toast.id), ToastService.DISMISS_AFTER_MS);
  }
}
