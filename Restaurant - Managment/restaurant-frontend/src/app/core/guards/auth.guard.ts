import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.sessionReady).pipe(
    filter((ready) => ready),
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        return true;
      }

      return router.createUrlTree(['/login'], {
        queryParams: {
          returnUrl: state.url,
        },
      });
    }),
  );
};
