import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    email: '',
    password: ''
  };

  isSubmitting = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  login(): void {
    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (user) => {
          this.toastService.success(`Welcome back, ${user.displayName || user.email}!`);
          this.router.navigateByUrl(this.redirectTo());
        },
        error: (error) => {
          this.errorMessage = this.authService.describeError(error);
          this.isSubmitting = false;
        }
      });
  }

  sendPasswordReset(): void {
    if (!this.credentials.email) {
      this.errorMessage = 'Enter your email address first, then click "Forgot password".';
      return;
    }

    this.authService.sendPasswordReset(this.credentials.email)
      .subscribe({
        next: () => this.toastService.success('Password reset email sent. Check your inbox.'),
        error: (error) => this.errorMessage = this.authService.describeError(error)
      });
  }

  private redirectTo(): string {
    return this.route.snapshot.queryParamMap.get('redirectTo') || '/employees';
  }
}
