
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const interviewerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // ✅ Unified token key

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const role = (payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])?.toLowerCase();

      if (Date.now() < exp && role === 'interviewer') {
        return true;
      }
    } catch {
      console.error('Invalid token format');
    }
  }

  router.navigate(['/interviewer-login']);
  return false;
};
