import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productsCount: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  categories: Category[] = [
    {
      id: 1,
      name: 'Burgers',
      description: 'Delicious burgers made with fresh ingredients.',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
      productsCount: 12,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Pizza',
      description: 'Freshly baked pizzas with authentic flavors.',
      image: 'https://images.unsplash.com/photo- pizza-placeholder',
      productsCount: 10,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Healthy Food',
      description: 'Fresh salads and healthy meals.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
      productsCount: 8,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Desserts',
      description: 'Sweet treats and delicious desserts.',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300',
      productsCount: 15,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Drinks',
      description: 'Refreshing cold and hot beverages.',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
      productsCount: 6,
      status: 'Inactive',
    },
    {
      id: 6,
      name: 'Sandwiches',
      description: 'Fresh sandwiches prepared daily.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300',
      productsCount: 4,
      status: 'Active',
    },
  ];

  searchTerm = '';
  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  formData = this.getEmptyForm();

  get activeCategories(): number {
    return this.categories.filter(
      (category) => category.status === 'Active',
    ).length;
  }

  get inactiveCategories(): number {
    return this.categories.filter(
      (category) => category.status === 'Inactive',
    ).length;
  }

  get totalProducts(): number {
    return this.categories.reduce(
      (total, category) => total + category.productsCount,
      0,
    );
  }

  get filteredCategories(): Category[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.categories;
    }

    return this.categories.filter(
      (category) =>
        category.name.toLowerCase().includes(search) ||
        category.description.toLowerCase().includes(search),
    );
  }

  private getEmptyForm() {
    return {
      name: '',
      description: '',
      image: '',
      status: 'Active' as 'Active' | 'Inactive',
    };
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.formData = this.getEmptyForm();
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.isEditing = true;
    this.editingId = category.id;

    this.formData = {
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status,
    };

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = this.getEmptyForm();
    this.editingId = null;
  }

  saveCategory(): void {
    const name = this.formData.name.trim();
    const description = this.formData.description.trim();
    const image = this.formData.image.trim();

    if (!name || !description || !image) {
      return;
    }

    const duplicate = this.categories.some(
      (category) =>
        category.name.toLowerCase() === name.toLowerCase() &&
        category.id !== this.editingId,
    );

    if (duplicate) {
      alert('A category with this name already exists.');
      return;
    }

    if (this.isEditing && this.editingId !== null) {
      this.categories = this.categories.map((category) =>
        category.id === this.editingId
          ? {
            ...category,
            name,
            description,
            image,
            status: this.formData.status,
          }
          : category,
      );
    } else {
      const newCategory: Category = {
        id: Math.max(0, ...this.categories.map((category) => category.id)) + 1,
        name,
        description,
        image,
        productsCount: 0,
        status: this.formData.status,
      };

      this.categories = [newCategory, ...this.categories];
    }

    this.closeModal();
  }

  deleteCategory(category: Category): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.categories = this.categories.filter(
      (item) => item.id !== category.id,
    );
  }

  toggleStatus(category: Category): void {
    this.categories = this.categories.map((item) =>
      item.id === category.id
        ? {
          ...item,
          status: item.status === 'Active' ? 'Inactive' : 'Active',
        }
        : item,
    );
  }
}
