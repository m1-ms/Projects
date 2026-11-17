
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification';
import { CartService } from '../../../core/services/cart.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  cartItemsCount = inject(CartService).totalItems;
  favoritesCount = inject(FavoritesService).totalFavorites;

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: response => {
        this.notificationService.success(
          response.message || 'You have been logged out successfully.'
        );

        void this.router.navigate(['/']);
      },

      error: () => {
        this.notificationService.error(
          'Unable to log out. Please try again.'
        );
      }
    });
  }
}
