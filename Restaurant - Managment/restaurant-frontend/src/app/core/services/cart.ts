import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  selectedSize?: string;
}

export interface CartProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'storm_cart';

  private itemsSignal = signal<CartItem[]>(this.loadCart());

  items = this.itemsSignal.asReadonly();

  totalItems = computed(() => this.itemsSignal().reduce((total, item) => total + item.quantity, 0));

  subtotal = computed(() =>
    this.itemsSignal().reduce((total, item) => total + item.price * item.quantity, 0),
  );

  addItem(product: CartProduct, quantity = 1, selectedSize?: string): void {
    const currentItems = this.itemsSignal();

    const existingItem = currentItems.find(
      (item) => item.id === product.id && item.selectedSize === selectedSize,
    );

    let updatedItems: CartItem[];

    if (existingItem) {
      updatedItems = currentItems.map((item) =>
        item.id === product.id && item.selectedSize === selectedSize
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, 20),
            }
          : item,
      );
    } else {
      updatedItems = [
        ...currentItems,
        {
          ...product,
          quantity,
          selectedSize,
        },
      ];
    }

    this.updateCart(updatedItems);
  }

  increaseQuantity(id: number, selectedSize?: string): void {
    const updatedItems = this.itemsSignal().map((item) => {
      if (item.id === id && item.selectedSize === selectedSize && item.quantity < 20) {
        return { ...item, quantity: item.quantity + 1 };
      }

      return item;
    });

    this.updateCart(updatedItems);
  }

  decreaseQuantity(id: number, selectedSize?: string): void {
    const updatedItems = this.itemsSignal().map((item) => {
      if (item.id === id && item.selectedSize === selectedSize && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }

      return item;
    });

    this.updateCart(updatedItems);
  }

  removeItem(id: number, selectedSize?: string): void {
    const updatedItems = this.itemsSignal().filter(
      (item) => !(item.id === id && item.selectedSize === selectedSize),
    );

    this.updateCart(updatedItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.itemsSignal.set(items);
    this.saveCart(items);
  }

  private loadCart(): CartItem[] {
    try {
      const savedCart = localStorage.getItem(this.storageKey);
      return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
