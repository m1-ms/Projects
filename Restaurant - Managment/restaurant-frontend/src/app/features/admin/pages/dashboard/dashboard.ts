
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: string;
  description: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Cancelled';
}

interface PopularProduct {
  name: string;
  category: string;
  sold: number;
  revenue: number;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stats: DashboardStat[] = [
    {
      title: 'Total Revenue',
      value: '$24,580',
      change: '+12.8%',
      icon: '$',
      description: 'Compared to last month',
    },
    {
      title: 'Total Orders',
      value: '1,284',
      change: '+8.2%',
      icon: '▣',
      description: 'Compared to last month',
    },
    {
      title: 'Total Customers',
      value: '856',
      change: '+5.4%',
      icon: '♙',
      description: 'Compared to last month',
    },
    {
      title: 'Total Products',
      value: '48',
      change: '+3 new',
      icon: '♧',
      description: 'Available in menu',
    },
  ];

  weeklySales = [
    { day: 'Mon', amount: 45, label: '$1,250' },
    { day: 'Tue', amount: 68, label: '$1,890' },
    { day: 'Wed', amount: 52, label: '$1,450' },
    { day: 'Thu', amount: 82, label: '$2,280' },
    { day: 'Fri', amount: 62, label: '$1,720' },
    { day: 'Sat', amount: 100, label: '$2,780' },
    { day: 'Sun', amount: 76, label: '$2,110' },
  ];

  orderDistribution = [
    { status: 'Completed', count: 684, percentage: 53 },
    { status: 'Processing', count: 320, percentage: 25 },
    { status: 'Pending', count: 190, percentage: 15 },
    { status: 'Cancelled', count: 90, percentage: 7 },
  ];

  recentOrders: RecentOrder[] = [
    {
      id: 'STR-10245',
      customer: 'James Wilson',
      date: 'Nov 07, 2026',
      amount: 48.50,
      status: 'Completed',
    },
    {
      id: 'STR-10244',
      customer: 'Sarah Mitchell',
      date: 'Nov 07, 2026',
      amount: 32.99,
      status: 'Processing',
    },
    {
      id: 'STR-10243',
      customer: 'Michael Brown',
      date: 'Nov 06, 2026',
      amount: 67.25,
      status: 'Pending',
    },
    {
      id: 'STR-10242',
      customer: 'Emily Davis',
      date: 'Nov 06, 2026',
      amount: 25.00,
      status: 'Completed',
    },
    {
      id: 'STR-10241',
      customer: 'Daniel Taylor',
      date: 'Nov 05, 2026',
      amount: 54.75,
      status: 'Cancelled',
    },
  ];

  popularProducts: PopularProduct[] = [
    {
      name: 'Classic Beef Burger',
      category: 'Burgers',
      sold: 245,
      revenue: 3182.55,
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&auto=format&fit=crop',
    },
    {
      name: 'Italian Cheese Pizza',
      category: 'Pizza',
      sold: 189,
      revenue: 2929.50,
      image:
        'https://images.unsplash.com/photo- pizza-placeholder',
    },
    {
      name: 'Fresh Garden Salad',
      category: 'Healthy Food',
      sold: 156,
      revenue: 1558.44,
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&auto=format&fit=crop',
    },
  ];

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}
