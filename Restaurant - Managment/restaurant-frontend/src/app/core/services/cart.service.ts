import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';

import {
  Observable,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
} from 'rxjs';

import { API_CONFIG } from '../api.config';
import { AuthService } from './auth.service';

export interface CartItem {
  id: number;
  cartItemId: number;
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

interface CartApiItem {
  id: number;
  productId: number;
  name: string;
  description: string | null;
  imagePath: string | null;
  categoryName: string | null;
  price: number;
  quantity: number;
  selectedSize: string | null;
  lineTotal: number;
}

interface CartApiData {
  id: number | null;
  items: CartApiItem[];
  totalItems: number;
  subtotal: number;
}

interface CartApiResponse {
  success: boolean;
  message: string;
  data: CartApiData;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly cartUrl = `${API_CONFIG.baseUrl}/cart`;

  private readonly itemsSignal = signal<CartItem[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal('');

  readonly items = this.itemsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.itemsSignal().reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  );

  constructor() {
    toObservable(this.authService.currentUser)
      .pipe(
        distinctUntilChanged(
          (previous, current) =>
            previous?.username === current?.username,
        ),
        switchMap(user => {
          if (!user) {
            this.loadingSignal.set(false);
            this.errorSignal.set('');

            return of(this.emptyCart());
          }

          this.loadingSignal.set(true);
          this.errorSignal.set('');

          return this.fetchCart().pipe(
            catchError(error => {
              this.errorSignal.set(this.getErrorMessage(error));
              return of(this.emptyCart());
            }),
            finalize(() => this.loadingSignal.set(false)),
          );
        }),
      )
      .subscribe(cart => {
        this.applyCart(cart);
      });
  }

  addItem(
    product: CartProduct,
    quantity = 1,
    selectedSize?: string,
  ): void {
    if (!this.authService.isLoggedIn()) {
      this.errorSignal.set('Please login before adding products to your cart.');
      return;
    }

    this.executeCartRequest(
      this.http.post<CartApiResponse>(
        `${this.cartUrl}/items`,
        {
          productId: product.id,
          quantity,
          selectedSize: this.normalizeSize(selectedSize),
        },
      ),
    );
  }

  increaseQuantity(id: number, selectedSize?: string): void {
    const item = this.findCartItem(id, selectedSize);

    if (!item || item.quantity >= 20) {
      return;
    }

    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(id: number, selectedSize?: string): void {
    const item = this.findCartItem(id, selectedSize);

    if (!item || item.quantity <= 1) {
      return;
    }

    this.updateQuantity(item, item.quantity - 1);
  }

  removeItem(id: number, selectedSize?: string): void {
    const item = this.findCartItem(id, selectedSize);

    if (!item) {
      return;
    }

    this.executeCartRequest(
      this.http.delete<CartApiResponse>(
        `${this.cartUrl}/items/${item.cartItemId}`,
      ),
    );
  }

  clearCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.itemsSignal.set([]);
      return;
    }

    this.executeCartRequest(
      this.http.delete<CartApiResponse>(this.cartUrl),
    );
  }

  refreshCart(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.loadingSignal.set(true);

    this.fetchCart()
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: cart => this.applyCart(cart),
        error: error => {
          this.errorSignal.set(this.getErrorMessage(error));
        },
      });
  }

  private updateQuantity(item: CartItem, quantity: number): void {
    this.executeCartRequest(
      this.http.put<CartApiResponse>(
        `${this.cartUrl}/items/${item.cartItemId}`,
        { quantity },
      ),
    );
  }

  private findCartItem(
    productId: number,
    selectedSize?: string,
  ): CartItem | undefined {
    const normalizedSize = this.normalizeSize(selectedSize);

    return this.itemsSignal().find(item =>
      item.id === productId &&
      this.normalizeSize(item.selectedSize) === normalizedSize,
    );
  }

  private fetchCart(): Observable<CartApiData> {
    return this.http
      .get<CartApiResponse>(this.cartUrl)
      .pipe(map(response => response.data));
  }

  private executeCartRequest(
    request: Observable<CartApiResponse>,
  ): void {
    this.errorSignal.set('');
    this.loadingSignal.set(true);

    request
      .pipe(
        finalize(() => this.loadingSignal.set(false)),
      )
      .subscribe({
        next: response => {
          if (!response.success || !response.data) {
            this.errorSignal.set(
              response.message || 'Unable to update your cart.',
            );
            return;
          }

          this.applyCart(response.data);
        },
        error: error => {
          this.errorSignal.set(this.getErrorMessage(error));
        },
      });
  }

  private applyCart(cart: CartApiData): void {
    const fallbackImage =
      'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&auto=format&fit=crop&q=85';

    const items: CartItem[] = (cart.items ?? []).map(item => ({
      id: item.productId,
      cartItemId: item.id,
      name: item.name,
      description: item.description ?? '',
      price: Number(item.price),
      category: item.categoryName ?? '',
      image: item.imagePath || fallbackImage,
      quantity: item.quantity,
      selectedSize: item.selectedSize ?? undefined,
    }));

    this.itemsSignal.set(items);
  }

  private emptyCart(): CartApiData {
    return {
      id: null,
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  private normalizeSize(size?: string | null): string | null {
    if (!size || !size.trim()) {
      return null;
    }

    return size.trim();
  }

  private getErrorMessage(error: unknown): string {
    const response = error as {
      error?: {
        message?: string;
      };
    };

    return (
      response?.error?.message ||
      'Unable to communicate with the cart service.'
    );
  }
}
