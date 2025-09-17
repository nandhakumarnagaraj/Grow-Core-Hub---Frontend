// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authservice } from '../services/authservice';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Authservice);
  const currentUser = authService.getCurrentUser();

  // Skip auth for login and signup requests
  if (req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
    return next(req);
  }

  // Add auth header if user is logged in
  if (currentUser) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.email}`, // In real app, you'd have a proper JWT token
        'Content-Type': 'application/json'
      }
    });
    return next(authReq);
  }

  return next(req);
};