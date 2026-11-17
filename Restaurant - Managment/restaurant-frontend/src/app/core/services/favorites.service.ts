
import {
  Injectable,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ProductService } from './product.service';

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
  private readonly productService = inject(ProductService);

  private readonly favoritesSignal = signal<FavoriteProduct[]>([]);

  readonly favorites = this.favoritesSignal.asReadonly();

  readonly totalFavorites = computed(
    () => this.favoritesSignal().length
  );

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=900&auto=format&fit=crop&q=85';

  constructor() {
    effect(() => {
      const username =
        this.authService.currentUser()?.username ?? null;

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

  syncFavoritesWithBackend(): void {
    const savedFavorites = this.favoritesSignal();

    if (savedFavorites.length === 0) return;

    const requests = savedFavorites.map(favorite =>
      this.productService.getProductById(favorite.id).pipe(
        map(response => {
          if (!response.success || !response.data) {
            return null;
          }

          const product = response.data;

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.categoryName,
            image: product.imagePath || this.fallbackImage,
            rating: 0,
            badge: undefined
          } satisfies FavoriteProduct;
        }),
        catchError(error => {
          // Remove products that no longer exist.
          if (error.status === 404) {
            return of(null);
          }

          // Keep saved data if the request fails temporarily.
          return of(favorite);
        })
      )
    );

    forkJoin(requests).subscribe(products => {
      this.updateFavorites(
        products.filter(
          (product): product is FavoriteProduct => product !== null
        )
      );
    });
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
