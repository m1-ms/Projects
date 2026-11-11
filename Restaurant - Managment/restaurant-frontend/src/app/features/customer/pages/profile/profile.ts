import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

interface Order {
  id: string;
  date: string;
  customer: OrderCustomer;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly profileStorageKey = 'storm_profile';

  profile: ProfileData = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  };

  orders: Order[] = [];

  saveMessage = '';
  saveMessageType: 'success' | 'error' = 'success';

  constructor() {
    this.loadProfile();
    this.loadOrders();
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get pendingOrders(): number {
    return this.orders.filter(
      (order) => order.status.toLowerCase() === 'pending',
    ).length;
  }

  get totalSpent(): number {
    return this.orders.reduce((total, order) => total + order.total, 0);
  }

  get recentOrders(): Order[] {
    return [...this.orders]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .slice(0, 3);
  }

  saveProfile(): void {
    this.saveMessage = '';

    const fullName = this.profile.fullName.trim();
    const email = this.profile.email.trim();
    const phone = this.profile.phone.trim();

    if (!fullName || !email || !phone) {
      this.showMessage('Please complete your name, email, and phone number.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showMessage('Please enter a valid email address.', 'error');
      return;
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(phone)) {
      this.showMessage('Please enter a valid phone number.', 'error');
      return;
    }

    const updatedProfile: ProfileData = {
      fullName,
      email,
      phone,
      city: this.profile.city.trim(),
      address: this.profile.address.trim(),
    };

    try {
      localStorage.setItem(
        this.profileStorageKey,
        JSON.stringify(updatedProfile),
      );

      this.profile = updatedProfile;
      this.showMessage('Your profile has been saved successfully.', 'success');
    } catch {
      this.showMessage('Unable to save your profile. Please try again.', 'error');
    }
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'pending') return 'pending';
    if (normalizedStatus === 'completed' || normalizedStatus === 'delivered') {
      return 'completed';
    }
    if (normalizedStatus === 'cancelled') return 'cancelled';
    if (normalizedStatus === 'processing') return 'processing';

    return 'pending';
  }

  getItemsCount(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  private loadProfile(): void {
    try {
      const savedProfile = localStorage.getItem(this.profileStorageKey);

      if (savedProfile) {
        this.profile = {
          ...this.profile,
          ...(JSON.parse(savedProfile) as Partial<ProfileData>),
        };
        return;
      }

      // Use the latest order's customer details as initial profile data.
      const savedOrders = JSON.parse(
        localStorage.getItem('storm_orders') || '[]',
      ) as Order[];

      const latestOrder = [...savedOrders].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      if (latestOrder?.customer) {
        this.profile = {
          fullName: latestOrder.customer.fullName || '',
          email: latestOrder.customer.email || '',
          phone: latestOrder.customer.phone || '',
          city: latestOrder.customer.city || '',
          address: latestOrder.customer.address || '',
        };
      }
    } catch {
      this.profile = {
        fullName: '',
        email: '',
        phone: '',
        city: '',
        address: '',
      };
    }
  }

  private loadOrders(): void {
    try {
      this.orders = JSON.parse(
        localStorage.getItem('storm_orders') || '[]',
      ) as Order[];
    } catch {
      this.orders = [];
    }
  }

  private showMessage(
    message: string,
    type: 'success' | 'error',
  ): void {
    this.saveMessage = message;
    this.saveMessageType = type;
  }
}
