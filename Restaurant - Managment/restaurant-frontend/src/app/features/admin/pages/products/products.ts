import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  status: 'Active' | 'Inactive';
  featured: boolean;
}

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  products: Product[] = [
    {
      id: 1,
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty with fresh lettuce and special sauce.',
      category: 'Burgers',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      status: 'Active',
      featured: true,
    },
    {
      id: 2,
      name: 'Double Cheese Burger',
      description: 'Double beef patty with melted cheddar cheese.',
      category: 'Burgers',
      price: 15.50,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400',
      status: 'Active',
      featured: true,
    },
    {
      id: 3,
      name: 'Italian Cheese Pizza',
      description: 'Classic Italian pizza with mozzarella and fresh basil.',
      category: 'Pizza',
      price: 15.50,
      image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400',
      status: 'Active',
      featured: true,
    },
    {
      id: 4,
      name: 'Pepperoni Pizza',
      description: 'Traditional pizza topped with pepperoni and cheese.',
      category: 'Pizza',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      status: 'Active',
      featured: false,
    },
    {
      id: 5,
      name: 'Fresh Garden Salad',
      description: 'Fresh seasonal vegetables with a light dressing.',
      category: 'Healthy Food',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      status: 'Active',
      featured: false,
    },
    {
      id: 6,
      name: 'Avocado Bowl',
      description: 'Healthy avocado bowl with fresh greens.',
      category: 'Healthy Food',
      price: 11.50,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      status: 'Inactive',
      featured: false,
    },
    {
      id: 7,
      name: 'Chocolate Delight',
      description: 'Rich chocolate dessert with creamy topping.',
      category: 'Desserts',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      status: 'Active',
      featured: true,
    },
    {
      id: 8,
      name: 'Strawberry Cheesecake',
      description: 'Creamy cheesecake topped with fresh strawberries.',
      category: 'Desserts',
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      status: 'Active',
      featured: false,
    },
    {
      id: 9,
      name: 'Fresh Lemonade',
      description: 'Refreshing homemade lemonade.',
      category: 'Drinks',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=400',
      status: 'Inactive',
      featured: false,
    },
  ];

  categories: string[] = [
    'Burgers',
    'Pizza',
    'Healthy Food',
    'Desserts',
    'Drinks',
    'Sandwiches',
  ];

  searchTerm = '';
  selectedCategory = 'All';
  selectedStatus = 'All';

  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  formData = this.getEmptyForm();

  get totalProducts(): number {
    return this.products.length;
  }

  get activeProducts(): number {
    return this.products.filter(
      (product) => product.status === 'Active',
    ).length;
  }

  get inactiveProducts(): number {
    return this.products.filter(
      (product) => product.status === 'Inactive',
    ).length;
  }

  get featuredProducts(): number {
    return this.products.filter((product) => product.featured).length;
  }

  get filteredProducts(): Product[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        product.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  private getEmptyForm() {
    return {
      name: '',
      description: '',
      category: 'Burgers',
      price: 0,
      image: '',
      status: 'Active' as 'Active' | 'Inactive',
      featured: false,
    };
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.formData = this.getEmptyForm();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditing = true;
    this.editingId = product.id;

    this.formData = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      status: product.status,
      featured: product.featured,
    };

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = this.getEmptyForm();
    this.editingId = null;
  }

  saveProduct(): void {
    const name = this.formData.name.trim();
    const description = this.formData.description.trim();
    const image = this.formData.image.trim();
    const price = Number(this.formData.price);

    if (
      !name ||
      !description ||
      !image ||
      !this.formData.category ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return;
    }

    const duplicate = this.products.some(
      (product) =>
        product.name.toLowerCase() === name.toLowerCase() &&
        product.id !== this.editingId,
    );

    if (duplicate) {
      alert('A product with this name already exists.');
      return;
    }

    if (this.isEditing && this.editingId !== null) {
      this.products = this.products.map((product) =>
        product.id === this.editingId
          ? {
            ...product,
            name,
            description,
            category: this.formData.category,
            price,
            image,
            status: this.formData.status,
            featured: this.formData.featured,
          }
          : product,
      );
    } else {
      const newProduct: Product = {
        id: Math.max(0, ...this.products.map((product) => product.id)) + 1,
        name,
        description,
        category: this.formData.category,
        price,
        image,
        status: this.formData.status,
        featured: this.formData.featured,
      };

      this.products = [newProduct, ...this.products];
    }

    this.closeModal();
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.products = this.products.filter(
      (item) => item.id !== product.id,
    );
  }

  toggleStatus(product: Product): void {
    this.products = this.products.map((item) =>
      item.id === product.id
        ? {
          ...item,
          status: item.status === 'Active' ? 'Inactive' : 'Active',
        }
        : item,
    );
  }

  toggleFeatured(product: Product): void {
    this.products = this.products.map((item) =>
      item.id === product.id
        ? { ...item, featured: !item.featured }
        : item,
    );
  }
}
