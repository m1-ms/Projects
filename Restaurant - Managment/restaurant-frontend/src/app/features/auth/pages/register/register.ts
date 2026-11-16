
import {
  Component,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  private successTimer?: ReturnType<typeof setTimeout>;

  username = '';
  email = '';
  age: number | null = null;
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;
  agreeToTerms = false;

  isSubmitting = false;

  ngOnDestroy(): void {
    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }
  }

  private showError(message: string): void {
    this.notificationService.error(message);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    if (this.username.trim().length < 7) {
      this.showError('Username must contain at least 7 characters.');
      return;
    }

    if (!this.email.trim()) {
      this.showError('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      this.showError('Please enter a valid email address.');
      return;
    }

    if (this.age === null || this.age < 16 || this.age > 80) {
      this.showError('Age must be between 16 and 80.');
      return;
    }

    if (this.password.length < 7) {
      this.showError('Password must contain at least 7 characters.');
      return;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.showError('Password must contain an uppercase letter.');
      return;
    }

    if (!/[a-z]/.test(this.password)) {
      this.showError('Password must contain a lowercase letter.');
      return;
    }

    if (!/[0-9]/.test(this.password)) {
      this.showError('Password must contain a number.');
      return;
    }

    if (!/[^A-Za-z0-9\s]/.test(this.password)) {
      this.showError('Password must contain a special character.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showError('Passwords do not match.');
      return;
    }

    if (!this.agreeToTerms) {
      this.showError('Please agree to the Terms & Conditions.');
      return;
    }

    this.isSubmitting = true;

    this.authService.signup({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      age: this.age
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          this.notificationService.success(
            response.message || 'Account created successfully.',
            5000
          );

          this.successTimer = setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);

          return;
        }

        this.showError(response.message || 'Registration failed.');
      },

      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        const apiMessage = error.error?.message;
        const validationErrors = error.error?.errors;

        if (validationErrors) {
          this.showError(Object.values(validationErrors).join(' '));
        } else if (apiMessage) {
          this.showError(apiMessage);
        } else if (error.status === 0) {
          this.showError(
            'Unable to connect to the server. Please try again.'
          );
        } else {
          this.showError('Registration failed. Please try again.');
        }
      }
    });
  }
}
