
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  CategoryService,
  PopularCategory,
} from '../../../../core/services/category.service';

@Component({
  selector: 'app-popular-categories',
  imports: [RouterLink],
  templateUrl: './popular-categories.html',
  styleUrl: './popular-categories.scss',
})
export class PopularCategories implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: PopularCategory[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPopularCategories();
  }

  private loadPopularCategories(): void {
    this.categoryService.getPopularCategories().subscribe({
      next: (response) => {
        this.categories = Array.isArray(response.data)
          ? response.data
          : [];

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load popular categories:', error);

        this.errorMessage =
          'Unable to load categories. Please try again later.';

        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
