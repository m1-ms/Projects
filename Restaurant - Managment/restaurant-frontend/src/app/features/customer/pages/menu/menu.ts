import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  debounceTime,
  Subject,
  Subscription,
} from 'rxjs';

import { CartService } from '../../../../core/services/cart.service';

import {
  FavoriteProduct,
  FavoritesService,
} from '../../../../core/services/favorites.service';

import {
  ProductService,
  Product,
} from '../../../../core/services/product.service';

import {
  Category,
  CategoryService,
} from '../../../../core/services/category.service';

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

export interface MenuCategory {
  id: number | null;
  name: string;
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
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  private searchSubject = new Subject<void>();
  private productsRequest?: Subscription;

  searchTerm = '';
  selectedCategory = 'All';
  selectedCategoryId: number | null = null;

  loading = false;
  errorMessage = '';

  currentPage = 1;
  pageSize = 8;
  totalPages = 0;
  totalElements = 0;

  categories: MenuCategory[] = [
    { id: null, name: 'All' },
  ];

  products: MenuProduct[] = [];

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=700&auto=format&fit=crop&q=85';

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(350),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.loadProducts(1);
      });

    this.loadCategories();
    this.loadProducts(1);
  }

  loadCategories(): void {
    this.categoryService
      .getCategories(1, 50)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          const backendCategories: Category[] =
            response.data?.content ?? [];

          this.categories = [
            { id: null, name: 'All' },
            ...backendCategories
              .filter(
                category => category.name.trim().toLowerCase() !== 'all'
              )
              .map(category => ({
                id: category.id,
                name: category.name,
              })),
          ];

          this.cdr.detectChanges();
        },

        error: error => {
          console.error('Failed to load categories:', error);

          this.categories = [
            { id: null, name: 'All' },
          ];

          this.cdr.detectChanges();
        },
      });
  }

  loadProducts(page = 1): void {
    this.productsRequest?.unsubscribe();

    this.currentPage = page;
    this.loading = true;
    this.errorMessage = '';

    this.productsRequest = this.productService
      .searchProducts(
        this.searchTerm,
        this.selectedCategoryId,
        this.currentPage,
        this.pageSize,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          const pageData = response.data;

          this.products = (pageData.content ?? []).map(
            (product: Product) => this.mapProduct(product),
          );

          this.currentPage = pageData.page;
          this.totalElements = pageData.totalElements;
          this.totalPages = pageData.totalPages;

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: error => {
          // The backend returns 404 when the search has no results.
          if (error.status === 404) {
            this.products = [];
            this.totalElements = 0;
            this.totalPages = 0;
            this.currentPage = 1;
          } else {
            console.error('Failed to load products:', error);

            this.products = [];
            this.totalElements = 0;
            this.totalPages = 0;

            this.errorMessage =
              'Unable to load products. Please try again later.';
          }

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

  get displayedRangeStart(): number {
    if (this.totalElements === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get displayedRangeEnd(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.totalElements,
    );
  }

  get visiblePages(): number[] {
    if (this.totalPages === 0) {
      return [];
    }

    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + 4);

    start = Math.max(1, end - 4);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
  }

  get cartCount(): number {
    return this.cartService.totalItems();
  }

  selectCategory(category: MenuCategory): void {
    this.selectedCategory = category.name;
    this.selectedCategoryId = category.id;

    this.loadProducts(1);
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.selectedCategoryId = null;

    this.loadProducts(1);
  }

  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage ||
      this.loading
    ) {
      return;
    }

    this.loadProducts(page);
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
