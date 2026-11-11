
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  username = '';
  email = '';
  age: number | null = null;
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;
  agreeToTerms = false;

  errorMessage = '';
  successMessage = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.username.trim().length < 7) {
      this.errorMessage = 'Username must contain at least 7 characters.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    if (this.age === null || this.age < 16 || this.age > 80) {
      this.errorMessage = 'Age must be between 16 and 80.';
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

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.agreeToTerms) {
      this.errorMessage = 'Please agree to the Terms & Conditions.';
      return;
    }

    this.successMessage =
      'Registration validation successful. Backend integration is pending.';
  }
}
