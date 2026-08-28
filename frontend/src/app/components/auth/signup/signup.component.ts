import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/app-user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupRequest = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as UserRole
  };

  isSubmitting = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  get passwordsMatch(): boolean {
    return this.signupRequest.password === this.signupRequest.confirmPassword;
  }

  signUp(): void {
    if (!this.passwordsMatch) {
      this.errorMessage = 'The two passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.signUp(
      this.signupRequest.name,
      this.signupRequest.email,
      this.signupRequest.password,
      this.signupRequest.role
    ).subscribe({
      next: (user) => {
        this.toastService.success(`Account created. Welcome, ${user.displayName}!`);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.errorMessage = this.authService.describeError(error);
        this.isSubmitting = false;
      }
    });
  }
}
