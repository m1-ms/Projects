
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { CartItem } from '../../../../core/services/cart.service';

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
  selector: 'app-order-confirmation',
    imports: [RouterLink, DatePipe],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss',
})
export class OrderConfirmation {
  private route = inject(ActivatedRoute);

  order: Order | null = null;

  constructor() {
    this.loadOrder();
  }

  private loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      return;
    }

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('storm_orders') || '[]',
      ) as Order[];

      this.order = savedOrders.find((order) => order.id === orderId) ?? null;
    } catch {
      this.order = null;
    }
  }

  get totalItems(): number {
    return this.order?.items.reduce(
      (total, item) => total + item.quantity,
      0,
    ) ?? 0;
  }
}
