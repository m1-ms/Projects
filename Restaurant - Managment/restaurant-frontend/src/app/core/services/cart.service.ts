
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';

import {
  Observable,
  catchError,
  concatMap,
  distinctUntilChanged,
  finalize,
  from,
  map,
  of,
  switchMap,
  tap,
  toArray,
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
  private readonly guestCartKey = 'storm_guest_cart';

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
            return of(this.guestCart());
          }

          this.loadingSignal.set(true);
          this.errorSignal.set('');

          return this.syncGuestCart().pipe(
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
    const pendingGuestItem = this.readGuestItems().find(item =>
      this.isSameLine(item, product.id, selectedSize),
    );

    if (!this.authService.isLoggedIn() || pendingGuestItem) {
      this.addGuestItem(product, quantity, selectedSize);
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

    if (!this.authService.isLoggedIn() || item.cartItemId === 0) {
      this.updateGuestQuantity(item, item.quantity + 1);
      return;
    }

    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(id: number, selectedSize?: string): void {
    const item = this.findCartItem(id, selectedSize);

    if (!item || item.quantity <= 1) {
      return;
    }

    if (!this.authService.isLoggedIn() || item.cartItemId === 0) {
      this.updateGuestQuantity(item, item.quantity - 1);
      return;
    }

    this.updateQuantity(item, item.quantity - 1);
  }

  removeItem(id: number, selectedSize?: string): void {
    const item = this.findCartItem(id, selectedSize);

    if (!item) {
      return;
    }

    if (!this.authService.isLoggedIn() || item.cartItemId === 0) {
      this.removeGuestItem(id, selectedSize);
      return;
    }

    this.executeCartRequest(
      this.http.delete<CartApiResponse>(
        `${this.cartUrl}/items/${item.cartItemId}`,
      ),
    );
  }

  clearCart(): void {
    this.storeGuestItems([]);
    this.errorSignal.set('');

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
      this.applyCart(this.guestCart());
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

  private addGuestItem(
    product: CartProduct,
    quantity: number,
    selectedSize?: string,
  ): void {
    const items = this.readGuestItems();
    const normalizedSize = this.normalizeSize(selectedSize);
    const safeQuantity = Math.min(
      20,
      Math.max(1, Math.floor(quantity)),
    );

    const existingIndex = items.findIndex(item =>
      this.isSameLine(item, product.id, normalizedSize),
    );

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: Math.min(
          20,
          items[existingIndex].quantity + safeQuantity,
        ),
      };
    } else {
      items.push({
        id: product.id,
        cartItemId: 0,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        image: product.image,
        quantity: safeQuantity,
        selectedSize: normalizedSize ?? undefined,
      });
    }

    this.storeGuestItems(items);

    if (this.authService.isLoggedIn()) {
      const updatedItem = items.find(item =>
        this.isSameLine(item, product.id, normalizedSize),
      );

      if (updatedItem) {
        this.itemsSignal.update(current => [
          ...current.filter(item =>
            !(
              item.cartItemId === 0 &&
              this.isSameLine(item, product.id, normalizedSize)
            ),
          ),
          updatedItem,
        ]);
      }
    } else {
      this.applyCart(this.guestCart());
    }
  }

  private updateGuestQuantity(
    item: CartItem,
    quantity: number,
  ): void {
    const updatedItems = this.readGuestItems().map(guestItem =>
      this.isSameLine(guestItem, item.id, item.selectedSize)
        ? { ...guestItem, quantity }
        : guestItem,
    );

    this.storeGuestItems(updatedItems);

    this.itemsSignal.update(current =>
      current.map(currentItem =>
        currentItem.cartItemId === 0 &&
        this.isSameLine(currentItem, item.id, item.selectedSize)
          ? { ...currentItem, quantity }
          : currentItem,
      ),
    );
  }

  private removeGuestItem(
    productId: number,
    selectedSize?: string,
  ): void {
    const remainingItems = this.readGuestItems().filter(
      item => !this.isSameLine(item, productId, selectedSize),
    );

    this.storeGuestItems(remainingItems);

    if (!this.authService.isLoggedIn()) {
      this.applyCart(this.guestCart());
      return;
    }

    this.itemsSignal.update(current =>
      current.filter(item =>
        !(
          item.cartItemId === 0 &&
          this.isSameLine(item, productId, selectedSize)
        ),
      ),
    );
  }

  private syncGuestCart(): Observable<CartApiData> {
    const guestItems = this.readGuestItems();

    if (guestItems.length === 0) {
      return this.fetchCart();
    }

    return from(guestItems).pipe(
      concatMap(item =>
        this.http.post<CartApiResponse>(
          `${this.cartUrl}/items`,
          {
            productId: item.id,
            quantity: item.quantity,
            selectedSize: this.normalizeSize(item.selectedSize),
          },
        ).pipe(
          tap(response => {
            if (response.success && response.data) {
              this.removeGuestItemFromStorage(
                item.id,
                item.selectedSize,
              );
            } else {
              this.errorSignal.set(
                response.message || 'Unable to sync a guest cart item.',
              );
            }
          }),
          catchError(error => {
            this.errorSignal.set(this.getErrorMessage(error));
            return of(null);
          }),
        ),
      ),
      toArray(),
      switchMap(() => this.fetchCart()),
    );
  }

  private removeGuestItemFromStorage(
    productId: number,
    selectedSize?: string,
  ): void {
    const remainingItems = this.readGuestItems().filter(
      item => !this.isSameLine(item, productId, selectedSize),
    );

    this.storeGuestItems(remainingItems);
  }

  private readGuestItems(): CartItem[] {
    let parsed: unknown;

    try {
      parsed = JSON.parse(
        localStorage.getItem(this.guestCartKey) ?? '[]',
      );
    } catch {
      return [];
    }

    if (!Array.isArray(parsed)) {
      return [];
    }

    const items: CartItem[] = [];

    for (const value of parsed as unknown[]) {
      if (typeof value !== 'object' || value === null) {
        continue;
      }

      const item = value as Record<string, unknown>;

      if (
        typeof item['id'] !== 'number' ||
        !Number.isInteger(item['id']) ||
        typeof item['name'] !== 'string' ||
        typeof item['description'] !== 'string' ||
        typeof item['price'] !== 'number' ||
        !Number.isFinite(item['price']) ||
        typeof item['category'] !== 'string' ||
        typeof item['image'] !== 'string' ||
        typeof item['quantity'] !== 'number' ||
        !Number.isInteger(item['quantity']) ||
        item['quantity'] < 1
      ) {
        continue;
      }

      items.push({
        id: item['id'] as number,
        cartItemId: 0,
        name: item['name'] as string,
        description: item['description'] as string,
        price: item['price'] as number,
        category: item['category'] as string,
        image: item['image'] as string,
        quantity: Math.min(20, item['quantity'] as number),
        selectedSize:
          typeof item['selectedSize'] === 'string'
            ? this.normalizeSize(item['selectedSize'] as string) ?? undefined
            : undefined,
      });
    }

    return items;
  }

  private storeGuestItems(items: CartItem[]): void {
    try {
      localStorage.setItem(
        this.guestCartKey,
        JSON.stringify(items),
      );
    } catch {
      this.errorSignal.set('Unable to save your guest cart.');
    }
  }

  private guestCart(): CartApiData {
    const items = this.readGuestItems().map(item => ({
      id: 0,
      productId: item.id,
      name: item.name,
      description: item.description,
      imagePath: item.image,
      categoryName: item.category,
      price: item.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize ?? null,
      lineTotal: item.price * item.quantity,
    }));

    return {
      id: null,
      items,
      totalItems: items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      subtotal: items.reduce(
        (total, item) => total + item.lineTotal,
        0,
      ),
    };
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
    return this.itemsSignal().find(item =>
      this.isSameLine(item, productId, selectedSize),
    );
  }

  private isSameLine(
    item: CartItem,
    productId: number,
    selectedSize?: string | null,
  ): boolean {
    return (
      item.id === productId &&
      this.normalizeSize(item.selectedSize) ===
      this.normalizeSize(selectedSize)
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

    const apiItems: CartItem[] = (cart.items ?? []).map(item => ({
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

    if (this.authService.isLoggedIn()) {
      const apiKeys = new Set(
        apiItems.map(item =>
          this.cartLineKey(item.id, item.selectedSize),
        ),
      );

      const pendingGuestItems = this.readGuestItems().filter(
        item => !apiKeys.has(
          this.cartLineKey(item.id, item.selectedSize),
        ),
      );

      this.itemsSignal.set([
        ...apiItems,
        ...pendingGuestItems,
      ]);

      return;
    }

    this.itemsSignal.set(apiItems);
  }

  private cartLineKey(
    productId: number,
    selectedSize?: string | null,
  ): string {
    return `${productId}:${this.normalizeSize(selectedSize) ?? ''}`;
  }

  private emptyCart(): CartApiData {
    return {
      id: null,
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  private normalizeSize(
    size?: string | null,
  ): string | null {
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
