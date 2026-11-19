import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  ChefService,
  Chef as ApiChef,
} from '../../../../core/services/chef.service';

interface Chef {
  id: number;
  name: string;
  specialization: string;
  image: string;
  facebookLink: string | null;
  twitterLink: string | null;
  instagramLink: string | null;
}

@Component({
  selector: 'app-chefs',
  imports: [RouterLink],
  templateUrl: './chefs.html',
  styleUrl: './chefs.scss',
})
export class Chefs implements OnInit {
  private readonly chefService = inject(ChefService);
  private readonly cdr = inject(ChangeDetectorRef);

  chefs: Chef[] = [];

  loading = false;
  errorMessage = '';

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=85';

  ngOnInit(): void {
    this.loadChefs();
  }

  get totalChefs(): number {
    return this.chefs.length;
  }

  loadChefs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.chefService.getChefs().subscribe({
      next: response => {
        if (!response.success || !response.data) {
          this.chefs = [];
          this.errorMessage = 'Unable to load chefs.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.chefs = response.data.content.map(
          chef => this.mapChef(chef),
        );

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.chefs = [];
        this.errorMessage =
          'Unable to load chefs. Please try again later.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapChef(chef: ApiChef): Chef {
    return {
      id: chef.id,
      name: chef.name,
      specialization: chef.specialization,
      image: chef.logoPath || this.fallbackImage,
      facebookLink: chef.facebookLink,
      twitterLink: chef.twitterLink,
      instagramLink: chef.instagramLink,
    };
  }
}
