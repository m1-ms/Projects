
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../../core/services/auth.service';
import { ContactService } from '../../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contacts implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly contactService = inject(ContactService);

  private readonly draftKey = 'storm_contact_draft';

  name = '';
  email = '';
  subject = '';
  message = '';

  loading = false;
  submitted = false;
  loginRequired = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.restoreDraft();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loginRequired = false;

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.subject.trim() ||
      !this.message.trim()
    ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.authService.sessionReady()) {
      this.saveDraft();
      this.loginRequired = true;
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.saveDraft();
      this.loginRequired = true;
      return;
    }

    this.loading = true;

    this.contactService.sendMessage({
      name: this.name.trim(),
      email: this.email.trim(),
      subject: this.subject.trim(),
      message: this.message.trim(),
    }).subscribe({
      next: response => {
        this.loading = false;

        if (!response.success) {
          this.errorMessage =
            response.message || 'Unable to send your message.';
          return;
        }

        this.submitted = true;
        this.successMessage =
          response.message || 'Your message has been sent successfully.';

        this.clearDraft();
        this.resetForm();
      },

      error: (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 401 || error.status === 403) {
          this.saveDraft();
          this.loginRequired = true;
          return;
        }

        if (error.status === 0) {
          this.errorMessage =
            'Unable to connect to the server. Please try again.';
          return;
        }

        this.errorMessage =
          error.error?.message ||
          'Something went wrong while sending your message.';
      },
    });
  }

  goToLogin(): void {
    this.saveDraft();

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/contact' },
    });
  }

  sendAnotherMessage(): void {
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
    this.resetForm();
  }

  private saveDraft(): void {
    const draft = {
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
    };

    sessionStorage.setItem(this.draftKey, JSON.stringify(draft));
  }

  private restoreDraft(): void {
    const savedDraft = sessionStorage.getItem(this.draftKey);

    if (!savedDraft) {
      return;
    }

    try {
      const draft = JSON.parse(savedDraft);

      this.name = draft.name ?? '';
      this.email = draft.email ?? '';
      this.subject = draft.subject ?? '';
      this.message = draft.message ?? '';
    } catch {
      this.clearDraft();
    }
  }

  private clearDraft(): void {
    sessionStorage.removeItem(this.draftKey);
  }

  private resetForm(): void {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }
}
