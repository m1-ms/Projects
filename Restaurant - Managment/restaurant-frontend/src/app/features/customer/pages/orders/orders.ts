
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';

import { CartItem } from '../../../../core/services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

interface Order {
  id: string;
  date: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
}

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private readonly authService = inject(AuthService);

  orders: Order[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    try {
      const user = this.authService.getUser();

      if (!user) {
        this.orders = [];
        return;
      }

      const storageKey = `storm_orders_${user.username}`;

      const savedOrders = JSON.parse(
        localStorage.getItem(storageKey) || '[]',
      ) as Order[];

      if (!Array.isArray(savedOrders)) {
        this.orders = [];
        this.errorMessage = 'Unable to load your orders.';
        return;
      }

      this.orders = [...savedOrders].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } catch {
      this.orders = [];
      this.errorMessage =
        'Something went wrong while loading your orders.';
    } finally {
      this.loading = false;
    }
  }

  getItemsCount(order: Order): number {
    return order.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}
