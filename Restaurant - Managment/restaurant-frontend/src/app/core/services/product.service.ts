
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  imagePath: string | null;
  featured: boolean;
  active: boolean;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface ProductPage {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    API_CONFIG.baseUrl + API_CONFIG.endpoints.products;

  getProducts(): Observable<ApiResponse<ProductPage>> {
    return this.http.get<ApiResponse<ProductPage>>(this.apiUrl);
  }

  getActiveProducts(
    page: number = 1,
    size: number = 10,
  ): Observable<ApiResponse<ProductPage>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ApiResponse<ProductPage>>(
      `${this.apiUrl}/active`,
      { params },
    );
  }

  getActiveProductsByCategory(
    categoryId: number,
    page: number = 1,
    size: number = 10,
  ): Observable<ApiResponse<ProductPage>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ApiResponse<ProductPage>>(
      `${this.apiUrl}/active/category/${categoryId}`,
      { params },
    );
  }

  getFeaturedProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      `${this.apiUrl}/featured`,
    );
  }

  searchProducts(
    key: string,
    categoryId: number | null,
    page: number,
    size: number,
  ): Observable<ApiResponse<ProductPage>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    const normalizedKey = key.trim();

    if (normalizedKey) {
      params = params.set('key', normalizedKey);
    }

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<ApiResponse<ProductPage>>(
      `${this.apiUrl}/search`,
      { params },
    );
  }

  searchActiveProducts(
    key: string,
    categoryId: number | null,
    page: number,
    size: number,
  ): Observable<ApiResponse<ProductPage>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    const normalizedKey = key.trim();

    if (normalizedKey) {
      params = params.set('key', normalizedKey);
    }

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<ApiResponse<ProductPage>>(
      `${this.apiUrl}/active/search`,
      { params },
    );
  }

  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  getActiveProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      `${this.apiUrl}/active/${id}`,
    );
  }
}
