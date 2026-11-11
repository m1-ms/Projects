import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'Unread' | 'Read' | 'Replied';
}

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, DatePipe],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  searchTerm = '';
  selectedStatus = 'All';
  selectedMessage: ContactMessage | null = null;
  showDetailsModal = false;

  messages: ContactMessage[] = [
    {
      id: 1,
      name: 'Ahmed Mohamed',
      email: 'ahmed@example.com',
      phone: '+20 100 123 4567',
      subject: 'Reservation Inquiry',
      message: 'Hello, I would like to ask about reserving a table for 6 people next Friday evening. Is there any availability?',
      date: '2026-11-07T10:30:00',
      status: 'Unread',
    },
    {
      id: 2,
      name: 'Sara Hassan',
      email: 'sara@example.com',
      phone: '+20 101 234 5678',
      subject: 'Food Quality',
      message: 'I really enjoyed my last visit. The food was excellent and the service was very professional.',
      date: '2026-11-06T15:45:00',
      status: 'Read',
    },
    {
      id: 3,
      name: 'Omar Khaled',
      email: 'omar@example.com',
      phone: '+20 102 345 6789',
      subject: 'Order Issue',
      message: 'My recent order arrived later than expected. I would appreciate your help regarding this issue.',
      date: '2026-11-05T18:20:00',
      status: 'Replied',
    },
    {
      id: 4,
      name: 'Mariam Ali',
      email: 'mariam@example.com',
      phone: '+20 103 456 7890',
      subject: 'Catering Services',
      message: 'I am interested in your catering services for a private event. Please send me more information about your packages.',
      date: '2026-11-04T12:10:00',
      status: 'Unread',
    },
    {
      id: 5,
      name: 'Youssef Ibrahim',
      email: 'youssef@example.com',
      phone: '+20 104 567 8901',
      subject: 'Business Partnership',
      message: 'We would like to discuss a potential business partnership with Storm Restaurant.',
      date: '2026-11-03T09:15:00',
      status: 'Read',
    },
    {
      id: 6,
      name: 'Nour Samir',
      email: 'nour@example.com',
      phone: '+20 105 678 9012',
      subject: 'General Feedback',
      message: 'Thank you for providing such a wonderful dining experience. I will definitely visit again.',
      date: '2026-11-02T20:00:00',
      status: 'Replied',
    },
  ];

  get totalMessages(): number {
    return this.messages.length;
  }

  get unreadMessages(): number {
    return this.messages.filter(message => message.status === 'Unread').length;
  }

  get readMessages(): number {
    return this.messages.filter(message => message.status === 'Read').length;
  }

  get repliedMessages(): number {
    return this.messages.filter(message => message.status === 'Replied').length;
  }

  get filteredMessages(): ContactMessage[] {
    const term = this.searchTerm.toLowerCase().trim();

    return this.messages
      .filter(message => {
        const matchesSearch =
          message.name.toLowerCase().includes(term) ||
          message.email.toLowerCase().includes(term) ||
          message.subject.toLowerCase().includes(term);

        const matchesStatus =
          this.selectedStatus === 'All' ||
          message.status === this.selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }

  openMessage(message: ContactMessage): void {
    this.selectedMessage = message;
    this.showDetailsModal = true;

    if (message.status === 'Unread') {
      message.status = 'Read';
      this.messages = [...this.messages];
    }
  }

  closeModal(): void {
    this.showDetailsModal = false;
    this.selectedMessage = null;
  }

  updateStatus(message: ContactMessage, status: ContactMessage['status']): void {
    message.status = status;
    this.messages = [...this.messages];

    if (this.selectedMessage?.id === message.id) {
      this.selectedMessage = { ...message };
    }
  }

  deleteMessage(message: ContactMessage): void {
    const confirmed = confirm(
      `Are you sure you want to delete the message from ${message.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.messages = this.messages.filter(item => item.id !== message.id);

    if (this.selectedMessage?.id === message.id) {
      this.closeModal();
    }
  }

  getStatusClass(status: ContactMessage['status']): string {
    return status.toLowerCase();
  }
}
