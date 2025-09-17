// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Authservice } from '../services/authservice';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(Authservice);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized - Please login again';
            authService.logout();
            router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = "Access forbidden - You don't have permission";
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict - Resource already exists';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation failed';
            break;
          case 500:
            errorMessage = 'Internal server error - Please try again later';
            break;
          case 503:
            errorMessage = 'Service unavailable - Please try again later';
            break;
          default:
            errorMessage = error.error?.message || `Server Error: ${error.status}`;
        }
      }

      // Log error to console for debugging
      console.error('HTTP Error:', {
        url: req.url,
        method: req.method,
        status: error.status,
        message: errorMessage,
        fullError: error,
      });

      // Return user-friendly error
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};
