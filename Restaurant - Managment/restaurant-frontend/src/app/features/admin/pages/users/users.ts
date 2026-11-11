import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'Blocked';
}

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  searchTerm = '';
  selectedStatus = 'All';
  showModal = false;
  isEditing = false;
  errorMessage = '';

  users: User[] = [
    {
      id: 1,
      username: 'Ahmed Mohamed',
      email: 'ahmed@example.com',
      phone: '+20 100 123 4567',
      joinedAt: '2026-01-15',
      ordersCount: 12,
      totalSpent: 245.50,
      status: 'Active',
    },
    {
      id: 2,
      username: 'Sara Hassan',
      email: 'sara@example.com',
      phone: '+20 101 234 5678',
      joinedAt: '2026-02-03',
      ordersCount: 8,
      totalSpent: 178.25,
      status: 'Active',
    },
    {
      id: 3,
      username: 'Omar Khaled',
      email: 'omar@example.com',
      phone: '+20 102 345 6789',
      joinedAt: '2026-03-20',
      ordersCount: 3,
      totalSpent: 65.00,
      status: 'Inactive',
    },
    {
      id: 4,
      username: 'Mariam Ali',
      email: 'mariam@example.com',
      phone: '+20 103 456 7890',
      joinedAt: '2026-04-11',
      ordersCount: 15,
      totalSpent: 320.75,
      status: 'Active',
    },
    {
      id: 5,
      username: 'Youssef Ibrahim',
      email: 'youssef@example.com',
      phone: '+20 104 567 8901',
      joinedAt: '2026-05-08',
      ordersCount: 0,
      totalSpent: 0,
      status: 'Blocked',
    },
    {
      id: 6,
      username: 'Nour Samir',
      email: 'nour@example.com',
      phone: '+20 105 678 9012',
      joinedAt: '2026-06-17',
      ordersCount: 6,
      totalSpent: 112.50,
      status: 'Active',
    },
  ];

  formData: User = this.getEmptyUser();

  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(user => user.status === 'Active').length;
  }

  get inactiveUsers(): number {
    return this.users.filter(user => user.status === 'Inactive').length;
  }

  get blockedUsers(): number {
    return this.users.filter(user => user.status === 'Blocked').length;
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.toLowerCase().trim();

    return this.users.filter(user => {
      const matchesSearch =
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        user.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.formData = this.getEmptyUser();
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.formData = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMessage = '';
  }

  saveUser(): void {
    const username = this.formData.username.trim();
    const email = this.formData.email.trim().toLowerCase();
    const phone = this.formData.phone.trim();

    if (!username || !email || !phone) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const duplicateEmail = this.users.some(user =>
      user.email.toLowerCase() === email &&
      user.id !== this.formData.id
    );

    if (duplicateEmail) {
      this.errorMessage = 'This email address is already registered.';
      return;
    }

    if (this.isEditing) {
      this.users = this.users.map(user =>
        user.id === this.formData.id
          ? {
            ...this.formData,
            username,
            email,
            phone,
          }
          : user
      );
    } else {
      const newUser: User = {
        ...this.formData,
        id: Math.max(0, ...this.users.map(user => user.id)) + 1,
        username,
        email,
        phone,
        joinedAt: new Date().toISOString().split('T')[0],
        ordersCount: 0,
        totalSpent: 0,
        status: 'Active',
      };

      this.users = [newUser, ...this.users];
    }

    this.closeModal();
  }

  toggleStatus(user: User): void {
    if (user.status === 'Active') {
      user.status = 'Inactive';
    } else {
      user.status = 'Active';
    }

    this.users = [...this.users];
  }

  blockUser(user: User): void {
    const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';

    user.status = newStatus;
    this.users = [...this.users];
  }

  deleteUser(user: User): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${user.username}?`
    );

    if (!confirmed) {
      return;
    }

    this.users = this.users.filter(item => item.id !== user.id);
  }

  getStatusClass(status: User['status']): string {
    return status.toLowerCase();
  }

  private getEmptyUser(): User {
    return {
      id: 0,
      username: '',
      email: '',
      phone: '',
      joinedAt: '',
      ordersCount: 0,
      totalSpent: 0,
      status: 'Active',
    };
  }
}
