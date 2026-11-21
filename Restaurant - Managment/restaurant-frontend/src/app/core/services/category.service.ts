import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';

export interface Category {
  id: number;
  name: string;
  logo: string;
  flag: string;
}

export interface CategoryPage {
  content: Category[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
}

export interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: CategoryPage;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    API_CONFIG.baseUrl + API_CONFIG.endpoints.categories;

  getCategories(
    page = 1,
    size = 50,
  ): Observable<CategoryApiResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<CategoryApiResponse>(
      this.apiUrl,
      { params },
    );
  }
}
