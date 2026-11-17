
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  catchError,
  finalize,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';

import { API_CONFIG } from '../api.config';

import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  SignUpRequest,
  UserResponse
} from '../models/auth.model';

type AuthUser = Pick<UserResponse, 'username' | 'roles'> | UserResponse;

interface CsrfTokenResponse {
  token: string;
  headerName: string;
  parameterName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly currentUserSignal = signal<AuthUser | null>(null);
  private readonly sessionReadySignal = signal(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly sessionReady = this.sessionReadySignal.asReadonly();

  constructor() {
    this.restoreSession();
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.getCsrfToken().pipe(
      switchMap(() =>
        this.http.post<ApiResponse<AuthResponse>>(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`,
          request
        )
      ),

      tap(response => {
        if (response.success && response.data) {
          this.currentUserSignal.set({
            username: response.data.username,
            roles: response.data.roles
          });
        }
      }),

      switchMap(response => {
        if (!response.success || !response.data) {
          return of(response);
        }

        return this.getCsrfToken().pipe(
          catchError(() => of(null)),
          map(() => response)
        );
      })
    );
  }

  signup(request: SignUpRequest): Observable<ApiResponse<UserResponse>> {
    return this.getCsrfToken().pipe(
      switchMap(() =>
        this.http.post<ApiResponse<UserResponse>>(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.signup}`,
          request
        )
      )
    );
  }

  getCurrentUser(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(
      `${API_CONFIG.baseUrl}/users/me`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentUserSignal.set(response.data);
        }
      })
    );
  }

  logout(): Observable<ApiResponse<void>> {
    return this.getCsrfToken().pipe(
      switchMap(() =>
        this.http.post<ApiResponse<void>>(
          `${API_CONFIG.baseUrl}/auth/logout`,
          {}
        )
      ),
      tap(() => {
        this.currentUserSignal.set(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  isLoggedIn(): boolean {
    return this.currentUserSignal() !== null;
  }

  getUser(): AuthUser | null {
    return this.currentUserSignal();
  }

  private getCsrfToken(): Observable<CsrfTokenResponse> {
    return this.http.get<CsrfTokenResponse>(
      `${API_CONFIG.baseUrl}/auth/csrf`
    );
  }

  private restoreSession(): void {
    this.getCsrfToken().pipe(
      switchMap(() => this.getCurrentUser()),

      map(response =>
        response.success && response.data
          ? response.data
          : null
      ),

      catchError(() => of(null)),

      finalize(() => {
        this.sessionReadySignal.set(true);
      })
    ).subscribe(user => {
      this.currentUserSignal.set(user);
    });
  }
}
