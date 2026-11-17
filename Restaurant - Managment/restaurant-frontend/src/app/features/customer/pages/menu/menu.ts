
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
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
export class Menu implements OnInit {
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  selectedCategory = 'All';

  loading = false;
  errorMessage = '';

  categories: string[] = ['All'];
  products: MenuProduct[] = [];

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
        console.log('API Response:', response);

        const backendProducts = response.data?.content ?? [];

        console.log('Backend Products:', backendProducts);

        this.products = backendProducts.map((product: Product) =>
          this.mapProduct(product)
        );

        console.log('Mapped Products:', this.products);

        const uniqueCategories = [
          ...new Set(
            this.products
              .map(product => product.category)
              .filter(category => !!category)
          ),
        ];

        this.categories = ['All', ...uniqueCategories];

        console.log('Categories:', this.categories);

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load products:', error);

        this.errorMessage =
          'Unable to load products. Please try again later.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapProduct(product: Product): MenuProduct {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.categoryName,
      image: product.imagePath || this.fallbackImage,
      rating: 0,
    };
  }

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
