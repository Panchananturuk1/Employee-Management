import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent {

  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  iconFor(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'fa-circle-check';
      case 'error':
        return 'fa-circle-exclamation';
      default:
        return 'fa-circle-info';
    }
  }
}
