import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

import { UserRole } from '../models/user-role';
import { Authservice } from '../services/authservice';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(Authservice);
  const router = inject(Router);

  const expectedRole = route.data['role'] as UserRole;

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (authService.hasRole(expectedRole)) {
    return true;
  }

  // User doesn't have the required role
  router.navigate(['/dashboard']);
  return false;
};
