import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppUser } from 'src/app/models/app-user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: AppUser | null = null;

  profileRequest = {
    displayName: '',
    photoURL: ''
  };

  passwordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isSavingProfile = false;
  isSavingPassword = false;

  private userSubscription?: Subscription;

  constructor(private authService: AuthService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe({
      next: (user) => {
        this.user = user;

        if (user) {
          this.profileRequest.displayName = user.displayName;
          this.profileRequest.photoURL = user.photoURL;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  get initials(): string {
    const source = this.profileRequest.displayName || this.user?.email || '';

    return source
      .split(' ')
      .filter(part => part.length > 0)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  }

  get newPasswordsMatch(): boolean {
    return this.passwordRequest.newPassword === this.passwordRequest.confirmPassword;
  }

  saveProfile(): void {
    this.isSavingProfile = true;

    this.authService.updateAccount(this.profileRequest.displayName, this.profileRequest.photoURL)
      .subscribe({
        next: () => {
          this.toastService.success('Profile updated.');
          this.isSavingProfile = false;
        },
        error: (error) => {
          this.toastService.error(this.authService.describeError(error));
          this.isSavingProfile = false;
        }
      });
  }

  changePassword(): void {
    if (!this.newPasswordsMatch) {
      this.toastService.error('The two new passwords do not match.');
      return;
    }

    this.isSavingPassword = true;

    this.authService.changePassword(this.passwordRequest.currentPassword, this.passwordRequest.newPassword)
      .subscribe({
        next: () => {
          this.toastService.success('Password changed.');
          this.passwordRequest = { currentPassword: '', newPassword: '', confirmPassword: '' };
          this.isSavingPassword = false;
        },
        error: (error) => {
          this.toastService.error(this.authService.describeError(error));
          this.isSavingPassword = false;
        }
      });
  }
}
