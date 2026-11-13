
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../api.config';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  SignUpRequest,
  UserResponse
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly tokenKey = 'storm_auth_token';
  private readonly userKey = 'storm_auth_user';

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`,
        request
      )
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveAuthData(response.data);
          }
        })
      );
  }

  signup(request: SignUpRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.signup}`,
      request
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthResponse | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthResponse;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private saveAuthData(auth: AuthResponse): void {
    localStorage.setItem(this.tokenKey, auth.token);
    localStorage.setItem(this.userKey, JSON.stringify(auth));
  }
}
