
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { AuthService } from './auth.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  let currentUser = signal<{
    username: string;
    roles: string[];
  } | null>(null);

  beforeEach(() => {
    currentUser = signal<{
      username: string;
      roles: string[];
    } | null>(null);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: AuthService,
          useValue: {
            currentUser: currentUser.asReadonly(),
            getUser: () => currentUser(),
          },
        },
      ],
    });

    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty favorites list', () => {
    expect(service.favorites()).toEqual([]);
    expect(service.totalFavorites()).toBe(0);
  });

  it('should not consider any product a favorite initially', () => {
    expect(service.isFavorite(7)).toBe(false);
  });
});
