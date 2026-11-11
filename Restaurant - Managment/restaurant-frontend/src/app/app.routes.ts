
import { Routes } from '@angular/router';

// Layouts
import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

// Customer Home
import { Home } from './features/customer/pages/home/home';

export const routes: Routes = [

  // Customer Website
  {
    path: '',
    component: CustomerLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/customer/pages/menu/menu')
            .then(m => m.Menu),
      },
      {
        path: 'product-details/:id',
        loadComponent: () =>
          import('./features/customer/pages/product-details/product-details')
            .then(m => m.ProductDetails),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/customer/pages/cart/cart')
            .then(m => m.Cart),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/customer/pages/checkout/checkout')
            .then(m => m.Checkout),
      },
      {
        path: 'order-confirmation/:id',
        loadComponent: () =>
          import('./features/customer/pages/order-confirmation/order-confirmation')
            .then(m => m.OrderConfirmation),
      },
      {
        path: 'chefs',
        loadComponent: () =>
          import('./features/customer/pages/chefs/chefs')
            .then(m => m.Chefs),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/customer/pages/orders/orders')
            .then(m => m.Orders),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/customer/pages/profile/profile')
            .then(m => m.Profile),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/customer/pages/contact/contact')
            .then(m => m.Contact),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/customer/pages/favorites/favorites')
            .then(m => m.Favorites),
      },
    ],
  },

  // Authentication
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register')
        .then(m => m.Register),
  },

  // Admin Dashboard
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard')
            .then(m => m.Dashboard),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/pages/categories/categories')
            .then(m => m.Categories),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/pages/products/products')
            .then(m => m.Products),
      },
      {
        path: 'chefs',
        loadComponent: () =>
          import('./features/admin/pages/chefs/chefs')
            .then(m => m.Chefs),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/pages/orders/orders')
            .then(m => m.Orders),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/pages/users/users')
            .then(m => m.Users),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./features/admin/pages/contacts/contacts')
            .then(m => m.Contacts),
      },
    ],
  },

  // Not Found
  {
    path: '**',
    redirectTo: '',
  },

];
