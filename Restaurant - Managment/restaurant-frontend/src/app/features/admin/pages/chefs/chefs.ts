import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Chef {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  email: string;
  phone: string;
  image: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-chefs',
  imports: [FormsModule],
  templateUrl: './chefs.html',
  styleUrl: './chefs.scss',
})
export class Chefs {
  chefs: Chef[] = [
    {
      id: 1,
      name: 'James Anderson',
      specialty: 'Head Chef',
      experience: 12,
      email: 'james@stormrestaurant.com',
      phone: '+20 100 111 2222',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sophia Martinez',
      specialty: 'Pastry Chef',
      experience: 8,
      email: 'sophia@stormrestaurant.com',
      phone: '+20 100 222 3333',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=300',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Daniel Roberts',
      specialty: 'Pizza Chef',
      experience: 6,
      email: 'daniel@stormrestaurant.com',
      phone: '+20 100 333 4444',
      image: 'https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Olivia Wilson',
      specialty: 'Sous Chef',
      experience: 9,
      email: 'olivia@stormrestaurant.com',
      phone: '+20 100 444 5555',
      image: 'https://images.unsplash.com/photo-1595257841889-eca2678454e2?w=300',
      status: 'Active',
    },
  ];

  searchTerm = '';
  selectedStatus = 'All';

  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  formData = this.getEmptyForm();

  get totalChefs(): number {
    return this.chefs.length;
  }

  get activeChefs(): number {
    return this.chefs.filter((chef) => chef.status === 'Active').length;
  }

  get inactiveChefs(): number {
    return this.chefs.filter((chef) => chef.status === 'Inactive').length;
  }

  get filteredChefs(): Chef[] {
    const term = this.searchTerm.toLowerCase().trim();

    return this.chefs.filter((chef) => {
      const matchesSearch =
        chef.name.toLowerCase().includes(term) ||
        chef.specialty.toLowerCase().includes(term) ||
        chef.email.toLowerCase().includes(term);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        chef.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  private getEmptyForm() {
    return {
      name: '',
      specialty: '',
      experience: 1,
      email: '',
      phone: '',
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

  openEditModal(chef: Chef): void {
    this.isEditing = true;
    this.editingId = chef.id;
    this.formData = {
      name: chef.name,
      specialty: chef.specialty,
      experience: chef.experience,
      email: chef.email,
      phone: chef.phone,
      image: chef.image,
      status: chef.status,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.formData = this.getEmptyForm();
  }

  saveChef(): void {
    const name = this.formData.name.trim();
    const specialty = this.formData.specialty.trim();
    const email = this.formData.email.trim();

    if (
      !name ||
      !specialty ||
      !email ||
      !this.formData.phone.trim() ||
      !this.formData.image.trim() ||
      this.formData.experience < 1
    ) {
      return;
    }

    const duplicate = this.chefs.some(
      (chef) =>
        chef.name.toLowerCase() === name.toLowerCase() &&
        chef.id !== this.editingId,
    );

    if (duplicate) {
      alert('A chef with this name already exists.');
      return;
    }

    if (this.isEditing && this.editingId !== null) {
      this.chefs = this.chefs.map((chef) =>
        chef.id === this.editingId
          ? { ...this.formData, id: chef.id, name, specialty, email }
          : chef,
      );
    } else {
      const newChef: Chef = {
        ...this.formData,
        id: this.chefs.length
          ? Math.max(...this.chefs.map((chef) => chef.id)) + 1
          : 1,
        name,
        specialty,
        email,
      };

      this.chefs = [...this.chefs, newChef];
    }

    this.closeModal();
  }

  deleteChef(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this chef?');

    if (!confirmed) return;

    this.chefs = this.chefs.filter((chef) => chef.id !== id);
  }

  toggleStatus(chef: Chef): void {
    this.chefs = this.chefs.map((item) =>
      item.id === chef.id
        ? {
          ...item,
          status: item.status === 'Active' ? 'Inactive' : 'Active',
        }
        : item,
    );
  }
}
