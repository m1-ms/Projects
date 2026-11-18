
import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, finalize } from 'rxjs';

import { AuthService } from './auth.service';
import { API_CONFIG } from '../api.config';

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

interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryName: string | null;
  imagePath: string | null;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/favorites`;

  private readonly favoritesSignal = signal<FavoriteProduct[]>([]);

  readonly favorites = this.favoritesSignal.asReadonly();

  readonly totalFavorites = computed(
    () => this.favoritesSignal().length
  );

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=900&auto=format&fit=crop&q=85';

  constructor() {
    effect((onCleanup) => {
      const username =
        this.authService.currentUser()?.username ?? null;

      if (!username) {
        this.favoritesSignal.set([]);
        this.loading.set(false);
        this.error.set(null);
        return;
      }

      const subscription = this.loadFavorites();

      onCleanup(() => subscription.unsubscribe());
    });
  }

  isFavorite(productId: number): boolean {
    return this.favoritesSignal().some(
      product => product.id === productId
    );
  }

  toggleFavorite(product: FavoriteProduct): void {
    if (!this.authService.getUser()) {
      return;
    }

    if (this.isFavorite(product.id)) {
      this.removeFavorite(product.id);
      return;
    }

    this.sendMutation(
      this.http.post<ApiResponse<ProductResponse[]>>(
        `${this.apiUrl}/${product.id}`,
        {}
      )
    );
  }

  removeFavorite(productId: number): void {
    if (!this.authService.getUser()) {
      return;
    }

    this.sendMutation(
      this.http.delete<ApiResponse<ProductResponse[]>>(
        `${this.apiUrl}/${productId}`
      )
    );
  }

  clearFavorites(): void {
    if (!this.authService.getUser()) {
      return;
    }

    this.sendMutation(
      this.http.delete<ApiResponse<ProductResponse[]>>(
        this.apiUrl
      )
    );
  }

  syncFavoritesWithBackend(): void {
    if (!this.authService.getUser()) {
      return;
    }

    this.loadFavorites();
  }

  private loadFavorites(): Subscription {
    this.loading.set(true);
    this.error.set(null);

    return this.http
      .get<ApiResponse<ProductResponse[]>>(this.apiUrl)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: response => this.handleResponse(response),
        error: error => this.handleError(error),
      });
  }

  private sendMutation(
    request: Observable<ApiResponse<ProductResponse[]>>
  ): void {
    this.error.set(null);

    request.subscribe({
      next: response => this.handleResponse(response),
      error: error => this.handleError(error),
    });
  }

  private handleResponse(
    response: ApiResponse<ProductResponse[]>
  ): void {
    if (!response.success || !Array.isArray(response.data)) {
      this.error.set('Failed to load favorites.');
      return;
    }

    const products: FavoriteProduct[] = response.data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: Number(product.price),
      category: product.categoryName ?? '',
      image: product.imagePath || this.fallbackImage,
      rating: 0,
    }));

    this.favoritesSignal.set(products);
    this.error.set(null);
  }

  private handleError(error: unknown): void {
    console.error('Favorites API Error:', error);

    this.error.set(
      'Something went wrong while updating favorites.'
    );
  }
}
