
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  CartService,
  CartItem,
} from '../../../../core/services/cart.service';

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
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  private cartService = inject(CartService);
  private router = inject(Router);

  deliveryFee = 3.99;
  paymentMethod = 'Cash on Delivery';

  customer: CustomerDetails = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  };

  errorMessage = '';
  orderPlaced = false;
  orderNumber = '';

  get cartItems(): CartItem[] {
    return this.cartService.items();
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get totalItems(): number {
    return this.cartService.totalItems();
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  placeOrder(): void {
    this.errorMessage = '';

    if (this.cartItems.length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    if (
      !this.customer.fullName.trim() ||
      !this.customer.email.trim() ||
      !this.customer.phone.trim() ||
      !this.customer.city.trim() ||
      !this.customer.address.trim()
    ) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customer.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(this.customer.phone.trim())) {
      this.errorMessage = 'Please enter a valid phone number.';
      return;
    }

    const order: Order = {
      id: `STR-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      customer: { ...this.customer },
      items: this.cartItems.map((item) => ({ ...item })),
      subtotal: this.subtotal,
      deliveryFee: this.deliveryFee,
      total: this.total,
      paymentMethod: this.paymentMethod,
      status: 'Pending',
    };

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('storm_orders') || '[]',
      ) as Order[];

      savedOrders.push(order);

      localStorage.setItem('storm_orders', JSON.stringify(savedOrders));

      this.orderNumber = order.id;
      this.cartService.clearCart();
      this.orderPlaced = true;

      void this.router.navigate(['/order-confirmation', order.id]);
    } catch {
      this.errorMessage = 'Unable to save your order. Please try again.';
    }
  }
}
