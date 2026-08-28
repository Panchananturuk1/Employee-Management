import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.waitForAuth().pipe(
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }

        if (user.role === 'admin') {
          return true;
        }

        this.toastService.error('Only administrators can change employee records.');
        return this.router.createUrlTree(['/employees']);
      })
    );
  }
}
