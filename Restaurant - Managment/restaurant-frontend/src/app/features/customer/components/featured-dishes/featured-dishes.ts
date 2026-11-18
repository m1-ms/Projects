import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';

import {
  FavoriteProduct,
  FavoritesService,
} from '../../../../core/services/favorites.service';

import {
  ProductService,
  Product,
} from '../../../../core/services/product.service';

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
export class FeaturedDishes implements OnInit {
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: FeaturedProduct[] = [];

  loading = false;
  errorMessage = '';

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&auto=format&fit=crop&q=85';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (response) => {
        const backendProducts = response.data?.content ?? [];

        this.products = backendProducts
          .slice(0, 4)
          .map((product: Product) => this.mapProduct(product));

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load featured products:', error);

        this.errorMessage =
          'Unable to load featured dishes. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapProduct(product: Product): FeaturedProduct {
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.categoryName,
      image: product.imagePath || this.fallbackImage,
      rating: 0,
    };
  }

  getProductQuantity(productId: number): number {
    return (
      this.cartService.items().find(
        item => item.id === productId && !item.selectedSize,
      )?.quantity ?? 0
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
