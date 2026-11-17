
import { HttpInterceptorFn } from '@angular/common/http';

import { API_CONFIG } from '../api.config';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  const value = cookie.substring(name.length + 1);

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith(API_CONFIG.baseUrl);

  if (!isApiRequest) {
    return next(req);
  }

  const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
  const isSafeMethod = safeMethods.includes(req.method.toUpperCase());

  const csrfToken = getCookie('XSRF-TOKEN');

  const headers: Record<string, string> = {};

  if (!isSafeMethod && csrfToken) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }

  const authenticatedRequest = req.clone({
    withCredentials: true,
    setHeaders: headers
  });

  return next(authenticatedRequest);
};
