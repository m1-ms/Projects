import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import { FavoriteProduct, FavoritesService } from '../../../../core/services/favorites.service';

interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  badge?: string;
}

@Component({
  selector: 'app-featured-dishes',
  imports: [RouterLink],
  templateUrl: './featured-dishes.html',
  styleUrl: './featured-dishes.scss',
})
export class FeaturedDishes {
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);

  products: FeaturedProduct[] = [
    {
      id: 1,
      name: 'Classic Beef Burger',
      description: 'Juicy grilled beef, fresh lettuce, tomato and our signature sauce.',
      price: 12.99,
      category: 'Burgers',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=85',
      rating: 4.9,
      badge: 'Bestseller',
    },
    {
      id: 3,
      name: 'Italian Cheese Pizza',
      description: 'Authentic Italian pizza topped with mozzarella and fresh basil.',
      price: 15.5,
      category: 'Pizza',
      image:
        'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700&auto=format&fit=crop&q=85',
      rating: 4.8,
      badge: 'Popular',
    },
    {
      id: 5,
      name: 'Fresh Garden Salad',
      description: 'A refreshing mix of seasonal vegetables and house dressing.',
      price: 9.99,
      category: 'Healthy Food',
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=85',
      rating: 4.7,
      badge: 'Healthy',
    },
    {
      id: 7,
      name: 'Chocolate Delight',
      description: 'Rich chocolate dessert with a soft center and creamy topping.',
      price: 8.5,
      category: 'Desserts',
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&auto=format&fit=crop&q=85',
      rating: 4.9,
      badge: 'New',
    },
  ];

  getProductQuantity(productId: number): number {
    return (
      this.cartService.items().find((item) => item.id === productId && !item.selectedSize)
        ?.quantity ?? 0
    );
  }

  addToCart(product: FeaturedProduct): void {
    this.cartService.addItem(product);
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  toggleFavorite(product: FeaturedProduct): void {
    const favoriteProduct: FavoriteProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating,
      badge: product.badge,
    };

    this.favoritesService.toggleFavorite(favoriteProduct);
  }

  isFavorite(productId: number): boolean {
    return this.favoritesService.isFavorite(productId);
  }
}
