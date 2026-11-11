
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = '';
  password = '';

  showPassword = false;
  rememberMe = false;

  errorMessage = '';
  successMessage = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.username.trim().length < 7) {
      this.errorMessage = 'Username must contain at least 7 characters.';
      return;
    }

    if (this.password.length < 7) {
      this.errorMessage = 'Password must contain at least 7 characters.';
      return;
    }

    if (!/[A-Z]/.test(this.password)) {
      this.errorMessage = 'Password must contain an uppercase letter.';
      return;
    }

    if (!/[a-z]/.test(this.password)) {
      this.errorMessage = 'Password must contain a lowercase letter.';
      return;
    }

    if (!/[0-9]/.test(this.password)) {
      this.errorMessage = 'Password must contain a number.';
      return;
    }

    if (!/[^A-Za-z0-9]/.test(this.password)) {
      this.errorMessage = 'Password must contain a special character.';
      return;
    }

    this.successMessage = 'Validation successful. Backend integration is pending.';
  }
}
