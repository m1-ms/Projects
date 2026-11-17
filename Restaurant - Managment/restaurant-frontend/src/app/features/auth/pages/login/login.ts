import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';

  showPassword = false;
  rememberMe = false;

  isLoading = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private showError(message: string): void {
    this.notificationService.error(message);
  }

  onSubmit(): void {
    if (this.isLoading) {
      return;
    }

    if (!this.username.trim() || !this.password) {
      this.showError('Please enter your username and password.');
      return;
    }

    this.isLoading = true;

    this.authService
      .login({
        username: this.username.trim(),
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          if (!response.success || !response.data) {
            this.showError(response.message || 'Login failed.');
            return;
          }

          this.notificationService.success(response.message || 'Login successful.');

          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          const targetUrl =
            returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/';

          void this.router.navigateByUrl(targetUrl);
        },

        error: (error: HttpErrorResponse) => {
          this.isLoading = false;

          const apiMessage = error.error?.message;
          const validationErrors = error.error?.errors;

          if (validationErrors) {
            this.showError(Object.values(validationErrors).join(' '));
          } else if (apiMessage) {
            this.showError(apiMessage);
          } else if (error.status === 0) {
            this.showError('Unable to connect to the server. Please try again.');
          } else if (error.status === 401 || error.status === 403) {
            this.showError('Invalid username or password.');
          } else {
            this.showError('Login failed. Please try again.');
          }
        },
      });
  }
}
