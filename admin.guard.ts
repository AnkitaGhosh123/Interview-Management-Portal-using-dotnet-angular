
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const role =
        (payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])?.toLowerCase();
      const secondLogin = payload.AdminSecondLogin === 'true';

      if (Date.now() < exp && role === 'admin' && secondLogin) {
        return true;
      }
    } catch {
      console.error('Invalid token format');
    }
  }

  router.navigate(['/admin-loginsecond']); // Redirect if token invalid or second login missing
  return false;
};

