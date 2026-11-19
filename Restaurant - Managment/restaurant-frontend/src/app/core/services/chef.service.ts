import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../api.config';

export interface Chef {
  id: number;
  name: string;
  specialization: string;
  logoPath: string | null;
  facebookLink: string | null;
  twitterLink: string | null;
  instagramLink: string | null;
  createdDate?: string;
  updatedDate?: string | null;
}

export interface ChefPage {
  content: Chef[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ChefApiResponse {
  success: boolean;
  message: string;
  data: ChefPage;
}

@Injectable({
  providedIn: 'root',
})
export class ChefService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${API_CONFIG.baseUrl}/chefs`;

  getChefs(page = 1, size = 50): Observable<ChefApiResponse> {
    return this.http.get<ChefApiResponse>(
      `${this.apiUrl}?page=${page}&size=${size}`,
    );
  }

  getChefById(id: number): Observable<{
    success: boolean;
    message: string;
    data: Chef;
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Chef;
    }>(`${this.apiUrl}/${id}`);
  }
}
