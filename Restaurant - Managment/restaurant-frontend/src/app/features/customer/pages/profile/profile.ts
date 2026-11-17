
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { UserResponse } from '../../../../core/models/auth.model';

interface Order {
  id: string;
  date: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
  };
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
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  profile: UserResponse | null = null;

  isLoading = true;
  errorMessage = '';

  orders: Order[] = [];

  ngOnInit(): void {
    this.loadProfile();
    this.loadOrders();
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get pendingOrders(): number {
    return this.orders.filter(
      order => order.status.toLowerCase() === 'pending',
    ).length;
  }

  get totalSpent(): number {
    return this.orders.reduce(
      (total, order) => total + order.total,
      0,
    );
  }

  get recentOrders(): Order[] {
    return [...this.orders]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .slice(0, 3);
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'pending') return 'pending';

    if (
      normalizedStatus === 'completed' ||
      normalizedStatus === 'delivered'
    ) {
      return 'completed';
    }

    if (normalizedStatus === 'cancelled') return 'cancelled';
    if (normalizedStatus === 'processing') return 'processing';

    return 'pending';
  }

  getItemsCount(order: Order): number {
    return order.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getCurrentUser().subscribe({
      next: response => {
        console.log('PROFILE API RESPONSE:', response);

        if (response.success && response.data) {
          this.profile = response.data;

          console.log('PROFILE DATA:', this.profile);
        } else {
          this.errorMessage =
            response.message || 'Unable to load your profile.';
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: error => {
        console.error('PROFILE API ERROR:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to load your profile. Please try again.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadOrders(): void {
    try {
      const user = this.authService.getUser();

      if (!user) {
        this.orders = [];
        return;
      }

      const storageKey = `storm_orders_${user.username}`;

      this.orders = JSON.parse(
        localStorage.getItem(storageKey) || '[]',
      ) as Order[];

    } catch {
      this.orders = [];
    }
  }
}
