import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  FavoriteProduct,
  FavoritesService,
} from '../../../../core/services/favorites.service';

import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private favoritesService = inject(FavoritesService);
  private cartService = inject(CartService);

  favorites = this.favoritesService.favorites;

  removeFavorite(productId: number): void {
    this.favoritesService.removeFavorite(productId);
  }

  addToCart(product: FavoriteProduct): void {
    this.cartService.addItem(product);
  }

  getProductQuantity(productId: number): number {
    return this.cartService.items().find(
      item => item.id === productId && !item.selectedSize
    )?.quantity ?? 0;
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    const quantity = this.getProductQuantity(productId);

    if (quantity <= 1) {
      this.cartService.removeItem(productId);
      return;
    }

    this.cartService.decreaseQuantity(productId);
  }

  clearFavorites(): void {
    this.favoritesService.clearFavorites();
  }
}
