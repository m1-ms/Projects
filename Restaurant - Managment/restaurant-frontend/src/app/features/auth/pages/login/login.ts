
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';

  showPassword = false;
  rememberMe = false;

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username.trim() || !this.password) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.authService.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (!response.success || !response.data) {
          this.errorMessage = response.message || 'Login failed.';
          return;
        }

        this.successMessage = response.message || 'Login successful.';

        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error.error?.message ||
          'Unable to login. Please check your credentials and try again.';
      }
    });
  }
}
