import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import {
  FavoriteProduct,
  FavoritesService,
} from '../../../../core/services/favorites.service';

export interface MenuProduct {
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
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);

  searchTerm = '';
  selectedCategory = 'All';

  categories: string[] = [
    'All',
    'Burgers',
    'Pizza',
    'Pasta',
    'Healthy Food',
    'Desserts',
    'Drinks',
  ];

  products: MenuProduct[] = [
    {
      id: 1,
      name: 'Classic Beef Burger',
      description: 'Juicy grilled beef, fresh lettuce, tomato and our signature sauce.',
      price: 12.99,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=85',
      rating: 4.9,
      badge: 'Bestseller',
    },
    {
      id: 2,
      name: 'Crispy Chicken Burger',
      description: 'Crispy chicken breast with fresh vegetables and creamy sauce.',
      price: 11.50,
      category: 'Burgers',
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700&auto=format&fit=crop&q=85',
      rating: 4.8,
      badge: 'Popular',
    },
    {
      id: 3,
      name: 'Italian Cheese Pizza',
      description: 'Authentic Italian pizza topped with mozzarella and fresh basil.',
      price: 15.50,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=700&auto=format&fit=crop&q=85',
      rating: 4.8,
      badge: 'Popular',
    },
    {
      id: 4,
      name: 'Pepperoni Pizza',
      description: 'Classic pizza with premium pepperoni, mozzarella and tomato sauce.',
      price: 16.99,
      category: 'Pizza',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&auto=format&fit=crop&q=85',
      rating: 4.9,
    },
    {
      id: 5,
      name: 'Fresh Garden Salad',
      description: 'A refreshing mix of seasonal vegetables and house dressing.',
      price: 9.99,
      category: 'Healthy Food',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=85',
      rating: 4.7,
      badge: 'Healthy',
    },
    {
      id: 6,
      name: 'Creamy Alfredo Pasta',
      description: 'Creamy Alfredo sauce with parmesan cheese and perfectly cooked pasta.',
      price: 13.99,
      category: 'Pasta',
      image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=700&auto=format&fit=crop&q=85',
      rating: 4.8,
    },
    {
      id: 7,
      name: 'Chocolate Delight',
      description: 'Rich chocolate dessert with a soft center and creamy topping.',
      price: 8.50,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&auto=format&fit=crop&q=85',
      rating: 4.9,
      badge: 'New',
    },
    {
      id: 8,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed oranges served chilled for a refreshing taste.',
      price: 5.99,
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=700&auto=format&fit=crop&q=85',
      rating: 4.6,
    },
  ];

  get filteredProducts(): MenuProduct[] {
    return this.products.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const search = this.searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  get cartCount(): number {
    return this.cartService.totalItems();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  onSearch(value: string): void {
    this.searchTerm = value;
  }

  getProductQuantity(productId: number): number {
    return this.cartService.items().find(
      item => item.id === productId && !item.selectedSize
    )?.quantity ?? 0;
  }

  addToCart(product: MenuProduct): void {
    this.cartService.addItem(product);
  }

  increaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  toggleFavorite(product: MenuProduct): void {
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
