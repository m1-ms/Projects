
import { Injectable, inject, signal } from '@angular/core';
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

  private readonly currentUserSignal = signal<AuthResponse | null>(
    this.readStoredUser()
  );

  readonly currentUser = this.currentUserSignal.asReadonly();

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

  getCurrentUser(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(
      `${API_CONFIG.baseUrl}/users/me`
    );
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthResponse | null {
    return this.currentUserSignal();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.currentUserSignal.set(null);
  }

  private saveAuthData(auth: AuthResponse): void {
    localStorage.setItem(this.tokenKey, auth.token);
    localStorage.setItem(this.userKey, JSON.stringify(auth));

    this.currentUserSignal.set(auth);
  }

  private readStoredUser(): AuthResponse | null {
    try {
      const user = localStorage.getItem(this.userKey);

      return user ? JSON.parse(user) as AuthResponse : null;
    } catch {
      return null;
    }
  }
}
