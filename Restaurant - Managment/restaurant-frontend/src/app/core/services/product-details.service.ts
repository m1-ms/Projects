import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';

export interface ProductDetails {
  id: number;
  productId: number;
  productName: string;
  ingredients: string;
  calories: number | null;
  preparationTimeMinutes: number | null;
  servingSize: string | null;
}

interface ProductDetailsApiResponse {
  success: boolean;
  message: string;
  data: ProductDetails;
}

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${API_CONFIG.baseUrl}/product-details`;

  getByProductId(
    productId: number,
  ): Observable<ProductDetailsApiResponse> {
    return this.http.get<ProductDetailsApiResponse>(
      `${this.apiUrl}/product/${productId}`,
    );
  }
}
