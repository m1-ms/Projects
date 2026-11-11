import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

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

  notification = '';
  selectedSize = 'Regular';
  quantity = 1;

  products: Product[] = [
    {
      id: 1,
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty, fresh lettuce, cheese and our signature sauce.',
      price: 12.99,
      category: 'Burgers',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=85',
      rating: 4.9,
      reviews: 128,
      badge: 'Bestseller',
      ingredients: ['Beef Patty', 'Fresh Lettuce', 'Cheddar Cheese', 'Tomato', 'Signature Sauce'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 3 },
        { name: 'Extra Large', extraPrice: 5 },
      ],
    },
    {
      id: 2,
      name: 'Double Cheese Burger',
      description: 'Two grilled beef patties with melted cheddar cheese.',
      price: 15.5,
      category: 'Burgers',
      image:
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=900&auto=format&fit=crop&q=85',
      rating: 4.8,
      reviews: 96,
      ingredients: ['Double Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Pickles', 'Burger Sauce'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 3 },
        { name: 'Extra Large', extraPrice: 5 },
      ],
    },
    {
      id: 3,
      name: 'Italian Cheese Pizza',
      description: 'Traditional Italian pizza topped with mozzarella and basil.',
      price: 15.5,
      category: 'Pizza',
      image:
        'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&auto=format&fit=crop&q=85',
      rating: 4.9,
      reviews: 142,
      badge: 'Popular',
      ingredients: ['Mozzarella', 'Fresh Basil', 'Tomato Sauce', 'Italian Herbs'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 4 },
        { name: 'Extra Large', extraPrice: 7 },
      ],
    },
    {
      id: 4,
      name: 'Pepperoni Pizza',
      description: 'Classic pizza with pepperoni, mozzarella and tomato sauce.',
      price: 17.99,
      category: 'Pizza',
      image:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&auto=format&fit=crop&q=85',
      rating: 4.7,
      reviews: 87,
      ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce', 'Italian Herbs'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 4 },
        { name: 'Extra Large', extraPrice: 7 },
      ],
    },
    {
      id: 5,
      name: 'Fresh Garden Salad',
      description: 'Fresh greens, cherry tomatoes, cucumber and house dressing.',
      price: 9.99,
      category: 'Healthy Food',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=85',
      rating: 4.8,
      reviews: 74,
      badge: 'Healthy',
      ingredients: ['Fresh Lettuce', 'Cherry Tomatoes', 'Cucumber', 'Olive Oil', 'House Dressing'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 2 },
      ],
    },
    {
      id: 6,
      name: 'Avocado Bowl',
      description: 'Fresh avocado, quinoa, vegetables and a light lemon dressing.',
      price: 11.5,
      category: 'Healthy Food',
      image:
        'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop&q=85',
      rating: 4.6,
      reviews: 58,
      ingredients: ['Avocado', 'Quinoa', 'Fresh Vegetables', 'Lemon Dressing'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 2 },
      ],
    },
    {
      id: 7,
      name: 'Chocolate Delight',
      description: 'Rich chocolate cake served with creamy chocolate sauce.',
      price: 8.5,
      category: 'Desserts',
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&auto=format&fit=crop&q=85',
      rating: 4.9,
      reviews: 112,
      badge: 'Special',
      ingredients: ['Chocolate Cake', 'Chocolate Sauce', 'Cream'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 2 },
      ],
    },
    {
      id: 8,
      name: 'Strawberry Cheesecake',
      description: 'Creamy cheesecake topped with fresh strawberry sauce.',
      price: 9.5,
      category: 'Desserts',
      image:
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&auto=format&fit=crop&q=85',
      rating: 4.8,
      reviews: 89,
      ingredients: ['Cream Cheese', 'Fresh Strawberries', 'Biscuit Base', 'Strawberry Sauce'],
      sizes: [
        { name: 'Regular', extraPrice: 0 },
        { name: 'Large', extraPrice: 2 },
      ],
    },
  ];

  product!: Product;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.product = this.products.find((item) => item.id === id) ?? this.products[0];
  }

  get selectedSizePrice(): number {
    const size = this.product.sizes.find((item) => item.name === this.selectedSize);

    return size?.extraPrice ?? 0;
  }

  get totalPrice(): number {
    return (this.product.price + this.selectedSizePrice) * this.quantity;
  }

  get relatedProducts(): Product[] {
    return this.products
      .filter((item) => item.category === this.product.category && item.id !== this.product.id)
      .slice(0, 3);
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
    this.cartService.addItem(
      {
        ...this.product,
        price: this.product.price + this.selectedSizePrice,
      },
      this.quantity,
      this.selectedSize,
    );

    this.notification = `${this.quantity} × ${this.product.name} added to your cart.`;
  }
}
