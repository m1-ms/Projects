
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CartService,
  CartItem,
} from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private cartService = inject(CartService);

  deliveryFee = 3.99;

  promoInput = '';
  appliedPromo = '';
  discountPercentage = 0;
  promoMessage = '';
  promoMessageType: 'success' | 'error' = 'success';

  get cartItems(): CartItem[] {
    return this.cartService.items();
  }

  get subtotal(): number {
    return this.cartService.subtotal();
  }

  get discountAmount(): number {
    return this.subtotal * (this.discountPercentage / 100);
  }

  get total(): number {
    if (this.cartItems.length === 0) {
      return 0;
    }

    return this.subtotal - this.discountAmount + this.deliveryFee;
  }

  get totalItems(): number {
    return this.cartService.totalItems();
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.increaseQuantity(
      item.id,
      item.selectedSize
    );
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.decreaseQuantity(
      item.id,
      item.selectedSize
    );
  }

  removeItem(itemId: number, selectedSize?: string): void {
    this.cartService.removeItem(itemId, selectedSize);

    if (this.cartItems.length === 0) {
      this.clearPromo();
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.clearPromo();
  }

  applyPromo(): void {
    const code = this.promoInput.trim().toUpperCase();

    if (!code) {
      this.showPromoMessage(
        'Please enter a promo code.',
        'error'
      );
      return;
    }

    if (this.appliedPromo === code) {
      this.showPromoMessage(
        'This promo code is already applied.',
        'error'
      );
      return;
    }

    const promoCodes: Record<string, number> = {
      STORM10: 10,
      WELCOME15: 15,
    };

    const discount = promoCodes[code];

    if (!discount) {
      this.showPromoMessage(
        'Invalid promo code. Please try again.',
        'error'
      );
      return;
    }

    this.appliedPromo = code;
    this.discountPercentage = discount;

    this.showPromoMessage(
      `${discount}% discount applied successfully!`,
      'success'
    );
  }

  removePromo(): void {
    this.clearPromo();

    this.showPromoMessage(
      'Promo code removed.',
      'success'
    );
  }

  onPromoInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.promoInput = target.value;
  }

  private clearPromo(): void {
    this.appliedPromo = '';
    this.discountPercentage = 0;
    this.promoInput = '';
    this.promoMessage = '';
  }

  private showPromoMessage(
    message: string,
    type: 'success' | 'error'
  ): void {
    this.promoMessage = message;
    this.promoMessageType = type;
  }
}
