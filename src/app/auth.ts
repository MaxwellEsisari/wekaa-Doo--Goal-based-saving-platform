// auth.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    router.navigate(['/']);  // Not logged in → back to home
    return false;
  }

  const user = JSON.parse(userStr);

  // If trying to go to /dashboard, decide where to send
  if (state.url === '/dashboard') {
    if (user.role === 'admin') {
      router.navigate(['/dashboard/admin']);
    } else {
      router.navigate(['/dashboard/user']);
    }
    return false; // stop here since we redirected
  }

  // Otherwise, check role properly
  const requiredRole = route.data['role'];
  if (requiredRole && user.role !== requiredRole) {
    router.navigate(['/']); // 🚫 no access → back to home
    return false;
  }

  return true;
};
