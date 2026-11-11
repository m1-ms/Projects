import { Component } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
}

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

interface Order {
  id: string;
  date: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
}

@Component({
  selector: 'app-orders',
  imports: [FormsModule, DatePipe, DecimalPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders {
  private readonly storageKey = 'storm_orders';

  orders: Order[] = [];
  searchTerm = '';
  selectedStatus = 'All';

  showDetailsModal = false;
  selectedOrder: Order | null = null;

  constructor() {
    this.loadOrders();
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get pendingOrders(): number {
    return this.orders.filter((order) => order.status === 'Pending').length;
  }

  get processingOrders(): number {
    return this.orders.filter((order) => order.status === 'Processing').length;
  }

  get completedOrders(): number {
    return this.orders.filter((order) => order.status === 'Completed').length;
  }

  get totalRevenue(): number {
    return this.orders
      .filter((order) => order.status !== 'Cancelled')
      .reduce((total, order) => total + order.total, 0);
  }

  get filteredOrders(): Order[] {
    const term = this.searchTerm.toLowerCase().trim();

    return this.orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(term) ||
        order.customer.fullName.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term);

      const matchesStatus =
        this.selectedStatus === 'All' ||
        order.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  loadOrders(): void {
    try {
      const savedOrders = localStorage.getItem(this.storageKey);
      const parsedOrders = savedOrders
        ? (JSON.parse(savedOrders) as Order[])
        : [];

      this.orders = parsedOrders.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } catch {
      this.orders = [];
    }
  }

  private saveOrders(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
  }

  getStatusClass(status: OrderStatus): string {
    return status.toLowerCase();
  }

  getItemsCount(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateStatus(order: Order, status: OrderStatus): void {
    this.orders = this.orders.map((item) =>
      item.id === order.id ? { ...item, status } : item,
    );

    this.saveOrders();

    if (this.selectedOrder?.id === order.id) {
      this.selectedOrder = { ...order, status };
    }
  }

  openDetails(order: Order): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  closeDetails(): void {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  deleteOrder(orderId: string): void {
    const confirmed = confirm(
      'Are you sure you want to delete this order?',
    );

    if (!confirmed) return;

    this.orders = this.orders.filter((order) => order.id !== orderId);
    this.saveOrders();

    if (this.selectedOrder?.id === orderId) {
      this.closeDetails();
    }
  }
}
