
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ContactService,
  ContactInfo,
} from '../../../../core/services/contact.service';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, DatePipe],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {
  private readonly contactService = inject(ContactService);

  messages: ContactInfo[] = [];

  selectedMessage: ContactInfo | null = null;
  showDetailsModal = false;

  searchTerm = '';

  loading = false;
  detailsLoading = false;

  errorMessage = '';
  detailsErrorMessage = '';

  deletingMessageId: number | null = null;

  page = 1;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadMessages();
  }

  get totalMessages(): number {
    return this.totalElements;
  }

  get currentPageMessages(): number {
    return this.messages.length;
  }

  get filteredMessages(): ContactInfo[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.messages;
    }

    return this.messages.filter(message =>
      message.name.toLowerCase().includes(term) ||
      message.email.toLowerCase().includes(term) ||
      message.subject.toLowerCase().includes(term) ||
      message.message.toLowerCase().includes(term) ||
      message.username.toLowerCase().includes(term)
    );
  }

  loadMessages(page = this.page): void {
    this.loading = true;
    this.errorMessage = '';

    this.contactService.getMessages(page, this.pageSize).subscribe({
      next: response => {
        this.loading = false;

        if (!response.success || !response.data) {
          this.messages = [];
          this.errorMessage =
            response.message || 'Unable to load contact messages.';
          return;
        }

        this.messages = response.data.content ?? [];
        this.page = response.data.page;
        this.totalElements = response.data.totalElements;
        this.totalPages = response.data.totalPages;
      },

      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.messages = [];

        if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'You are not authorized to view contact messages.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Unable to connect to the server. Please try again.';
        } else {
          this.errorMessage =
            error.error?.message ||
            'Something went wrong while loading messages.';
        }
      },
    });
  }

  openMessage(message: ContactInfo): void {
    this.selectedMessage = message;
    this.showDetailsModal = true;
    this.detailsLoading = true;
    this.detailsErrorMessage = '';

    this.contactService.getMessageById(message.id).subscribe({
      next: response => {
        this.detailsLoading = false;

        if (!response.success || !response.data) {
          this.detailsErrorMessage =
            response.message || 'Unable to load message details.';
          return;
        }

        this.selectedMessage = response.data;
      },

      error: (error: HttpErrorResponse) => {
        this.detailsLoading = false;

        this.detailsErrorMessage =
          error.error?.message ||
          'Unable to load message details.';
      },
    });
  }

  closeModal(): void {
    this.showDetailsModal = false;
    this.selectedMessage = null;
    this.detailsErrorMessage = '';
  }

  deleteMessage(message: ContactInfo): void {
    const confirmed = confirm(
      `Are you sure you want to delete the message from ${message.name}?`
    );

    if (!confirmed || this.deletingMessageId !== null) {
      return;
    }

    this.deletingMessageId = message.id;
    this.errorMessage = '';

    this.contactService.deleteMessage(message.id).subscribe({
      next: response => {
        this.deletingMessageId = null;

        if (!response.success) {
          this.errorMessage =
            response.message || 'Unable to delete this message.';
          return;
        }

        if (this.selectedMessage?.id === message.id) {
          this.closeModal();
        }

        const shouldGoToPreviousPage =
          this.messages.length === 1 && this.page > 1;

        this.loadMessages(
          shouldGoToPreviousPage ? this.page - 1 : this.page
        );
      },

      error: (error: HttpErrorResponse) => {
        this.deletingMessageId = null;

        this.errorMessage =
          error.error?.message ||
          'Something went wrong while deleting the message.';
      },
    });
  }

  previousPage(): void {
    if (this.page > 1 && !this.loading) {
      this.loadMessages(this.page - 1);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages && !this.loading) {
      this.loadMessages(this.page + 1);
    }
  }
}
