
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';

import {
  ProductService,
  Product as ApiProduct,
} from '../../../../core/services/product.service';

import {
  ProductDetailsService,
  ProductDetails as ApiProductDetails,
} from '../../../../core/services/product-details.service';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  ingredients: string[];
  sizes: {
    name: string;
    extraPrice: number;
  }[];
}

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private productDetailsService = inject(ProductDetailsService);
  private cdr = inject(ChangeDetectorRef);

  notification = '';
  selectedSize = 'Regular';
  quantity = 1;

  loading = false;
  errorMessage = '';

  product: Product | null = null;
  productDetails: ApiProductDetails | null = null;
  relatedProducts: Product[] = [];

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=900&auto=format&fit=crop&q=85';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id || Number.isNaN(id)) {
        this.errorMessage = 'Invalid product ID.';
        this.product = null;
        this.productDetails = null;
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.loadProduct(id);
    });
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.notification = '';
    this.product = null;
    this.productDetails = null;
    this.relatedProducts = [];
    this.quantity = 1;
    this.selectedSize = 'Regular';

    this.productService.getProductById(id).subscribe({
      next: response => {
        if (!response.success || !response.data) {
          this.errorMessage = 'Product not found.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.product = this.mapProduct(response.data);
        this.loading = false;

        this.cdr.detectChanges();

        this.loadProductDetails(id);
        this.loadRelatedProducts();
      },

      error: () => {
        this.errorMessage =
          'Unable to load this product. Please try again later.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadProductDetails(productId: number): void {
    this.productDetailsService.getByProductId(productId).subscribe({
      next: response => {
        this.productDetails =
          response.success ? response.data : null;

        this.cdr.detectChanges();
      },

      error: () => {
        // Product details are optional.
        // Keep the main product visible when no details exist.
        this.productDetails = null;
        this.cdr.detectChanges();
      },
    });
  }

  private mapProduct(product: ApiProduct): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.categoryName,
      image: product.imagePath || this.fallbackImage,
      rating: 0,
      reviews: 0,
      ingredients: [],
      sizes: [
        {
          name: 'Regular',
          extraPrice: 0,
        },
      ],
    };
  }

  private loadRelatedProducts(): void {
    if (!this.product) {
      return;
    }

    const currentProduct = this.product;

    this.productService.getProducts().subscribe({
      next: response => {
        const products = response.data?.content ?? [];

        this.relatedProducts = products
          .filter(item =>
            item.id !== currentProduct.id &&
            item.categoryName === currentProduct.category
          )
          .slice(0, 3)
          .map(item => this.mapProduct(item));

        this.cdr.detectChanges();
      },

      error: () => {
        this.relatedProducts = [];
        this.cdr.detectChanges();
      },
    });
  }

  // Convert the API ingredients string into a displayable list.
  get ingredientList(): string[] {
    const ingredients = this.productDetails?.ingredients;

    if (!ingredients) {
      return [];
    }

    return ingredients
      .split(',')
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 0);
  }

  get selectedSizePrice(): number {
    const size = this.product?.sizes.find(
      item => item.name === this.selectedSize
    );

    return size?.extraPrice ?? 0;
  }

  get totalPrice(): number {
    if (!this.product) {
      return 0;
    }

    return (
      this.product.price + this.selectedSizePrice
    ) * this.quantity;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  increaseQuantity(): void {
    if (this.quantity < 20) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    this.cartService.addItem(
      this.product,
      this.quantity,
      this.selectedSize
    );

    this.notification =
      `${this.quantity} × ${this.product.name} added to your cart.`;
  }
}
