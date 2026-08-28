import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUser } from './models/app-user.model';
import { AuthService } from './services/auth.service';
import { Theme, ThemeService } from './services/theme.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fullstack.UI';
  currentYear = new Date().getFullYear();

  user$: Observable<AppUser | null>;
  theme$: Observable<Theme>;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  initialsFor(user: AppUser): string {
    const source = user.displayName || user.email;

    return source
      .split(' ')
      .filter(part => part.length > 0)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.toastService.info('You have been signed out.');
          this.router.navigate(['/login']);
        },
        error: (error) => this.toastService.error(this.authService.describeError(error))
      });
  }
}
