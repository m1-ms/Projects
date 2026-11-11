import { Injectable, computed, signal } from '@angular/core';

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
  private readonly storageKey = 'storm_favorites';

  private favoritesSignal = signal<FavoriteProduct[]>(this.loadFavorites());

  favorites = this.favoritesSignal.asReadonly();

  totalFavorites = computed(() => this.favoritesSignal().length);

  isFavorite(productId: number): boolean {
    return this.favoritesSignal().some((product) => product.id === productId);
  }

  toggleFavorite(product: FavoriteProduct): void {
    if (this.isFavorite(product.id)) {
      this.removeFavorite(product.id);
      return;
    }

    this.updateFavorites([...this.favoritesSignal(), product]);
  }

  removeFavorite(productId: number): void {
    const updated = this.favoritesSignal().filter(
      (product) => product.id !== productId,
    );

    this.updateFavorites(updated);
  }

  clearFavorites(): void {
    this.updateFavorites([]);
  }

  private updateFavorites(products: FavoriteProduct[]): void {
    this.favoritesSignal.set(products);
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  private loadFavorites(): FavoriteProduct[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? (JSON.parse(saved) as FavoriteProduct[]) : [];
    } catch {
      return [];
    }
  }
}
