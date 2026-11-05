import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_URL } from '../config/api-url.token';
import { AuthService } from './auth.service';

/** Agrega el token Bearer solo a las peticiones dirigidas a nuestra API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  const token = inject(AuthService).token();

  if (!token || !req.url.startsWith(apiUrl)) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
