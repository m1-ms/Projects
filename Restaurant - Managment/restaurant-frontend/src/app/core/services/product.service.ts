
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  createdDate?: string;
  updatedDate?: string | null;
}

export interface ProductPage {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  private readonly apiUrl =
    API_CONFIG.baseUrl + API_CONFIG.endpoints.products;

  getProducts(): Observable<ApiResponse<ProductPage>> {
    return this.http.get<ApiResponse<ProductPage>>(this.apiUrl);
  }

  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }
}
