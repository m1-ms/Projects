
import {
  Injectable,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import { AuthService } from './auth.service';

export interface FavoriteProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  badge?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly authService = inject(AuthService);

  private readonly favoritesSignal = signal<FavoriteProduct[]>([]);

  readonly favorites = this.favoritesSignal.asReadonly();

  readonly totalFavorites = computed(
    () => this.favoritesSignal().length
  );

  constructor() {
    effect(() => {
      const username = this.authService.currentUser()?.username ?? null;

      this.loadFavorites(username);
    });
  }

  isFavorite(productId: number): boolean {
    return this.favoritesSignal().some(
      product => product.id === productId
    );
  }

  toggleFavorite(product: FavoriteProduct): void {
    if (!this.authService.getUser()) return;

    if (this.isFavorite(product.id)) {
      this.removeFavorite(product.id);
      return;
    }

    this.updateFavorites([
      ...this.favoritesSignal(),
      product
    ]);
  }

  removeFavorite(productId: number): void {
    this.updateFavorites(
      this.favoritesSignal().filter(
        product => product.id !== productId
      )
    );
  }

  clearFavorites(): void {
    this.updateFavorites([]);
  }

  private updateFavorites(products: FavoriteProduct[]): void {
    const user = this.authService.getUser();

    if (!user) {
      this.favoritesSignal.set([]);
      return;
    }

    const key = `storm_favorites_${user.username}`;

    this.favoritesSignal.set(products);

    localStorage.setItem(key, JSON.stringify(products));
  }

  private loadFavorites(username: string | null): void {
    if (!username) {
      this.favoritesSignal.set([]);
      return;
    }

    try {
      const key = `storm_favorites_${username}`;
      const saved = localStorage.getItem(key);

      const products = saved
        ? JSON.parse(saved) as FavoriteProduct[]
        : [];

      this.favoritesSignal.set(
        Array.isArray(products) ? products : []
      );
    } catch {
      this.favoritesSignal.set([]);
    }
  }
}
