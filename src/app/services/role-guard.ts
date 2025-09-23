import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role = this.authService.getRole();
    const expectedRole = route.data['role']; // role from route config

    if (!role) {
      this.router.navigate(['/']); // not logged in
      return false;
    }

    // ✅ if the route requires a role and user matches → allow
    if (expectedRole && role === expectedRole) {
      return true;
    }

    // ✅ redirect users to their correct dashboard
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'ROLE_USER') {
      this.router.navigate(['/user-dashboard']);
    } else {
      this.router.navigate(['/']);
    }

    return false;
  }
}
